import { Entity } from '@backstage/catalog-model';

export const SOURCEGRAPH_REPO_ID = 'source-graph-repo-id';

export const useSourcegraphRepoId = (entity: Entity) => {
  return entity?.metadata.annotations?.[SOURCEGRAPH_REPO_ID] ?? '';
};
