import {
  createRouter,
  DefaultJenkinsInfoProvider,
} from '@backstage/plugin-jenkins-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin({
  logger,
  config,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const catalog = new CatalogClient({ discoveryApi: discovery });

  return await createRouter({
    logger,
    jenkinsInfoProvider: DefaultJenkinsInfoProvider.fromConfig({
      catalog,
      config,
    }),
  });
}
