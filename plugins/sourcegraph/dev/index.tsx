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
import { Entity } from '@backstage/catalog-model';
import { createDevApp, EntityGridItem } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import {
  EntitySourcegraphContent,
  EntitySourcegraphCard,
  MockSourcegraphApi,
  SourcegraphApi,
  sourcegraphApiRef,
} from '../src';
import { SOURCEGRAPH_REPO_ID } from '../src/components/useSourcegraphRepoId';
import { Content, Header, Page } from '@backstage/core-components';

const entity = (name?: string, repoId?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [SOURCEGRAPH_REPO_ID]: repoId,
      },
      name: name,
    },
  } as Entity);

createDevApp()
  .registerApi({
    api: sourcegraphApiRef,
    deps: {},
    factory: () =>
      ({
        search: async (query: string) => new MockSourcegraphApi().search(query),
        pendingBatchChange: async (repoId: string) => new MockSourcegraphApi().pendingBatchChange(repoId)
      } as SourcegraphApi),
  })
  .addPage({
    title: 'Entity Content',
    element: (
      <Page themeId="home">
        <Header title="Sourcegraph" />
        <Content>
          <EntityProvider entity={entity('error')}>
            <EntitySourcegraphContent />
          </EntityProvider>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'Cards',
    element: (
      <Page themeId="home">
        <Header title="Sourcegraph" />
        <Content>
          <Grid container>
            <EntityGridItem xs={12} md={6} entity={entity('values', 'example-sourcegraph-repo-id')}>
              <EntitySourcegraphCard />
            </EntityGridItem>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .render();

