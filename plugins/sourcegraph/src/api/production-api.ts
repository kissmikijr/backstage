import { SourcegraphSearchResult } from './sourcegraph-search-result';
import { SourcegraphApi } from './sourcegraph-api';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export class ProductionSourcegraphApi implements SourcegraphApi {
  constructor(private readonly discoveryApi: DiscoveryApi) {}

  async search(query: string): Promise<SourcegraphSearchResult[]> {
    if (!query) {
      return [];
    }

    const apiUrl = `${await this.discoveryApi.getBaseUrl(
      'sourcegraph',
    )}/.api/graphql`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.constructQuery(query)),
    });

    if (response.status >= 400 && response.status < 600) {
      throw new Error('Failed querying sourcegraph issues');
    }
    const result = await response.json();
    const r: SourcegraphSearchResult[] = await Promise.all(
      result.data.search.results.results.flatMap(async (f: any) => {
        if (f.lineMatches.length === 0) {
          return {
            url: f.repository.url,
            name: f.repository.name,
            file: f.file.name,
            highlights: null,
          };
        }
        const highlights = await this.fetchHighlightedFile({
          repoName: f.repository.name,
          commitID: f.file.commit.oid,
          filePath: f.file.path,
          disableTimeout: false,
          isLightTheme: false,
          ranges: f.lineMatches.flatMap((l: any) => ({
            startLine: l.lineNumber - 1,
            endLine: l.lineNumber + 2,
          })),
        });
        return {
          url: f.repository.url,
          name: f.repository.name,
          path: f.file.path,
          file: f.file.name,
          highlights,
        };
      }),
    );
    return r;
  }
  async fetchHighlightedFile({
    repoName,
    commitID,
    filePath,
    disableTimeout,
    isLightTheme,
    ranges,
  }: {
    repoName: string;
    commitID: string;
    filePath: string;
    disableTimeout: boolean;
    isLightTheme: boolean;
    ranges: { startLine: number; endLine: number };
  }): Promise<string[][]> {
    const query = {
      query: `query HighlightedFile(
        $repoName: String!
        $commitID: String!
        $filePath: String!
        $disableTimeout: Boolean!                    
        $isLightTheme: Boolean!                    
        $ranges: [HighlightLineRange!]!
      ) {
        repository(name: $repoName) {
          commit(rev: $commitID) {
            file(path: $filePath) {
              isDirectory
              richHTML
              highlight(disableTimeout: $disableTimeout, isLightTheme: $isLightTheme) {
                aborted
                lineRanges(ranges: $ranges)
              }
            }
          }
        }
      }`,
      variables: {
        repoName,
        commitID,
        filePath,
        disableTimeout,
        isLightTheme,
        ranges,
      },
    };
    const apiUrl = `${await this.discoveryApi.getBaseUrl(
      'sourcegraph',
    )}/.api/graphql`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    const result = await response.json();
    return result.data.repository.commit.file.highlight.lineRanges;
  }
  async pendingBatchChange(repoId: string): Promise<{ pr: string }[]> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl(
      'sourcegraph',
    )}/.api/graphql`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query BatchChangesInRepo($first: Int, $onlyPublishedByThisBatchChange: Boolean, $onlyArchived: Boolean, $repo: ID) {
          batchChanges(state: OPEN) {
            nodes {
              id
              name
              changesets(
                first: $first
                onlyPublishedByThisBatchChange: $onlyPublishedByThisBatchChange
                onlyArchived: $onlyArchived
                repo: $repo
              ) {
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
                nodes {
                  ...ChangesetFields
                }
              }
            }
          }
        }
        
        fragment ChangesetFields on Changeset {
          __typename
          ... on HiddenExternalChangeset {
            ...HiddenExternalChangesetFields
          }
          ... on ExternalChangeset {
            ...ExternalChangesetFields
          }
        }
        
        fragment HiddenExternalChangesetFields on HiddenExternalChangeset {
          __typename
          id
          createdAt
          updatedAt
          nextSyncAt
          state
        }
        
        fragment ExternalChangesetFields on ExternalChangeset {
          __typename
          id
          state
          error
          syncerError
          labels {
            ...ChangesetLabelFields
          }
          repository {
            name
            url
          }
          externalURL {
            url
          }
          createdAt
          updatedAt
        }
        
        fragment ChangesetLabelFields on ChangesetLabel {
          color
          description
          text
        }
        `,
        variables: {
          first: 50,
          onlyPublishedByThisBatchChange: true,
          onlyArchived: false,
          repo: repoId,
        },
      }),
    });

    const result = await response.json();

    const openPullrequests: { pr: string }[] =
      result.data.batchChanges.nodes.flatMap((batchChange: any) => {
        return batchChange.changesets.nodes.flatMap((changeSet: any) => {
          return { pr: changeSet.externalURL.url };
        });
      });

    return openPullrequests.flatMap(x => x);
  }

  constructQuery(queryParam: string): { query: string; variables: {} } {
    return {
      query: `query($query: String!) {
        search(query: $query) {
          results {
            results {
              __typename
              ... on FileMatch {
                repository {
                  id
                  name
                  url
                }
                file {
                  name
                  path
                  commit {
                    oid
                    abbreviatedOID
                  }
                }
                lineMatches {
                  lineNumber
                }
              }
            }
          }
        }
      }
      `,
      variables: { query: queryParam },
    };
  }
}
