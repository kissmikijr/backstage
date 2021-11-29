import { SourcegraphSearchResult } from './sourcegraph-search-result';
import { createApiRef } from '@backstage/core-plugin-api';

export const sourcegraphApiRef = createApiRef<SourcegraphApi>({
  id: 'plugin.sourcegraph.service',
  description: 'Used by the Sourcegraph plugin to make requests',
});

export interface SourcegraphApi {
  search(query: string): Promise<SourcegraphSearchResult[]>;
  pendingBatchChange(serviceName: string): Promise<{ pr: string }[]>;
}
