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
import React from 'react';
import { useAsync } from 'react-use';
import { sourcegraphApiRef } from '../../api';
import { useSourcegraphRepoId } from '../useSourcegraphRepoId';
import { yellow } from '@material-ui/core/colors';
import WarningIcon from '@material-ui/icons/Warning';
import EmptyStateImage from '../../assets/emptystate.svg';

import { Progress, InfoCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Typography, Grid } from '@material-ui/core';
import Link from '@material-ui/core/Link';

export const EntityBatchChanges = ({ entity }: { entity: Entity }) => {
  const sourcegraphApi = useApi(sourcegraphApiRef);
  const location = useSourcegraphRepoId(entity);
  const { loading, value } = useAsync(
    () => sourcegraphApi.pendingBatchChange(location),
    [sourcegraphApi, entity],
  );
  if (loading) {
    return <Progress />;
  }
  return (
    <InfoCard title="Batch changes">
      {value && value.length ? (
        <Grid container direction="column" spacing={2}>
          {value?.map((repo: any) => (
            <Grid container direction="row" spacing={2}>
              <Grid item xs={3}>
                <WarningIcon style={{ color: yellow[500] }} />
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <Link href={repo.pr} target="_blank" rel="noopener">
                    {repo.pr}
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={3} container justifyContent="flex-end">
                <WarningIcon style={{ color: yellow[500] }} />
              </Grid>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          container
          justify="space-around"
          direction="row"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={6}>
            <Typography variant="h6">
              There are no pending batch changes.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <img
              src={EmptyStateImage}
              alt="EmptyState"
              data-testid="emptyStateImg"
            />
          </Grid>
        </Grid>
      )}
    </InfoCard>
  );
};
