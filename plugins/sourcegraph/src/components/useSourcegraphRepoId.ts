import { Entity } from '@backstage/catalog-model';

export const REPO_ID = 'source-graph-repo-id';

export const useSourcegraphRepoId = (entity: Entity) => {
  return entity?.metadata.annotations?.[REPO_ID] ?? '';
};
