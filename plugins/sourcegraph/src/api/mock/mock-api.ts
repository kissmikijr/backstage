/*
 * Copyright 2020 The Backstage Authors
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

import { SourcegraphSearchResult } from '../sourcegraph-search-result';
import { SourcegraphApi } from '../sourcegraph-api';
import mockData from './sourcegraph-issue-mock.json';
import mockBatchChangesData from './sourcegraph-batch-changes-mock.json';

function getMockBatchChanges(_repoId: string): { pr: string }[] {
  return [...mockBatchChangesData];
}
function getMockSearches(_query: string): SourcegraphSearchResult[] {
  return [...mockData];
}

export class MockSourcegraphApi implements SourcegraphApi {
  search(query: string): Promise<SourcegraphSearchResult[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(getMockSearches(query)), 800);
    });
  }
  pendingBatchChange(repoId: string): Promise<{ pr: string }[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(getMockBatchChanges(repoId)), 800);
    });
  }
}
