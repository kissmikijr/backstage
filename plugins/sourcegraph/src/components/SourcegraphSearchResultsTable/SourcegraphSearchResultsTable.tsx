import React from 'react';
import { SourcegraphSearchResult } from '../../api';
import { makeStyles } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';

const useStyles = makeStyles({
  a: {
    color: '#4393e7',
  },
});

type SourcegraphSearchResultsTableProps = {
  searchResults: SourcegraphSearchResult[];
  query: string;
};

const SourcegraphSearchResultsTable = ({
  searchResults,
  query,
}: SourcegraphSearchResultsTableProps) => {
  return (
    <InfoCard>
      {searchResults.map(searchResult => (
        <SearchResult data={searchResult} query={query} />
      ))}
    </InfoCard>
  );
};
const SearchResult = ({
  data,
  query,
}: {
  data: SourcegraphSearchResult;
  query: string;
}) => {
  const classes = useStyles();
  return (
    <div className="theme-dark theme-redesign">
      <div className="result-container">
        <div>
          <a
            href={'https://' + data.name}
            target="_blank"
            rel="noopener"
            className={classes.a}
          >
            {data.name}
          </a>
          {' > '}
          <a
            href={
              'https://' + data.name + '/tree/master/' + data.path || data.file
            }
            target="_blank"
            rel="noopener"
            className={classes.a}
          >
            {data.file}
          </a>
        </div>
        <div className="file-match-children">
          {data.highlights ? (
            data.highlights?.map((l: any) => {
              const regexp = new RegExp(`(${query})`, 'i');
              return (
                <div className="file-match-children__item-code-wrapper test-file-match-children-item-wrapper">
                  <code className="code-excerpt">
                    <table>
                      <tbody>
                        {l.map((h: any) => (
                          <tr
                            style={{ borderBottom: '1px solid gray' }}
                            dangerouslySetInnerHTML={{
                              __html: h.replace(
                                regexp,
                                `<span class="selection-highlight">$1</span>`,
                              ),
                            }}
                          ></tr>
                        ))}
                      </tbody>
                    </table>
                  </code>
                </div>
              );
            })
          ) : (
            <>Path match</>
          )}
        </div>
      </div>
    </div>
  );
};
export default SourcegraphSearchResultsTable;
