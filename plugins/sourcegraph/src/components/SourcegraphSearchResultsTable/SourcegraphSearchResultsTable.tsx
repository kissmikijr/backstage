/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
            href={`https://${data.name}`}
            target="_blank"
            rel="noopener"
            className={classes.a}
          >
            {data.name}
          </a>
          {' > '}
          <a
            href={
              `https://${data.name}/tree/master/${data.path}` || data.file
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
                           />
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
export default SourcegraphSearchResultsTable;
