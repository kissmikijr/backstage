import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { ProductionSourcegraphApi, sourcegraphApiRef } from './api';

import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  path: '/sourcegraph',
  title: 'sourcegraph',
});

export const sourcegraphPlugin = createPlugin({
  id: 'sourcegraph',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: sourcegraphApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new ProductionSourcegraphApi(discoveryApi),
    }),
  ],
});
