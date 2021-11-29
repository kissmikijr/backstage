import { Entity } from '@backstage/catalog-model';

export const SOURCE_LOCATION = 'backstage.io/source-location';

export const useSourceLocation = (entity: Entity) => {
  console.log(entity?.metadata.annotations?.[SOURCE_LOCATION]);
  return (
    entity?.metadata.annotations?.[SOURCE_LOCATION].replace('url:', '') ?? ''
  );
};
