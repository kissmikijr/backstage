import React from 'react';
import { useEntityFromUrl } from '@backstage/plugin-catalog-react';
import { sourcegraphPlugin, rootRouteRef } from './plugin';
import {
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

export const EntitySourcegraphContent = sourcegraphPlugin.provide(
  createRoutableExtension({
    mountPoint: rootRouteRef,
    component: () =>
      import('./components/SourcegraphSearchResultsWidget').then(
        ({ SourcegraphSearchResultsWidget }) => {
          const SourcegraphSearchPage = () => {
            const { entity } = useEntityFromUrl();
            return entity ? (
              <SourcegraphSearchResultsWidget entity={entity} />
            ) : (
              <></>
            );
          };
          return SourcegraphSearchPage;
        },
      ),
  }),
);

export const EntitySourcegraphCard = sourcegraphPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/SourcegraphSearchResultsWidget').then(
          ({ SourcegraphSearchResultsWidget }) => {
            const SourcegraphSearchCard = () => {
              const { entity } = useEntityFromUrl();
              return entity ? (
                <SourcegraphSearchResultsWidget entity={entity} />
              ) : (
                <></>
              );
            };
            return SourcegraphSearchCard;
          },
        ),
    },
  }),
);

export const EntityBatchChangesCard = sourcegraphPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/SourcegraphSearchResultsWidget').then(
          ({ EntityBatchChanges }) => {
            const BatchChangesCard = () => {
              const { entity } = useEntityFromUrl();
              return entity ? <EntityBatchChanges entity={entity} /> : <></>;
            };
            return BatchChangesCard;
          },
        ),
    },
  }),
);
