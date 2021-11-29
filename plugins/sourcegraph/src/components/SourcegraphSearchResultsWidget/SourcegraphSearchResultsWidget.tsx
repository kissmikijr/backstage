import { Entity } from '@backstage/catalog-model';
import React, { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { sourcegraphApiRef } from '../../api';
import SourcegraphSearchResultsTable from '../SourcegraphSearchResultsTable/SourcegraphSearchResultsTable';
import { useSourceLocation } from '../useSourceLocation';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import { Button, makeStyles } from '@material-ui/core';

import {
  EmptyState,
  InfoCard,
  InfoCardVariants,
  Progress,
} from '@backstage/core-components';

import { ErrorApi, errorApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  item: {
    border: '1px solid gray',
  },
});

export const SourcegraphSearchResultsWidget = ({
  entity,
  variant = 'gridItem',
}: {
  entity: Entity;
  variant?: InfoCardVariants;
}) => {
  const classes = useStyles();
  const errorApi = useApi<ErrorApi>(errorApiRef);
  const sourcegraphApi = useApi(sourcegraphApiRef);
  const sourceLocation = useSourceLocation(entity);
  const [query, setQuery] = useState('');

  const l = sourceLocation.replace('https://', '').split('.');
  const [{ loading, value, error }, fetchQuery] = useAsyncFn(
    () => sourcegraphApi.search(query + ` repo:^${l[0]}\.${l[1]}$`),
    [sourcegraphApi, query],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          fetchQuery();
        }}
      >
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item zeroMinWidth xs={12}>
            <div className="flex">
              <Input
                classes={{ root: classes.item }}
                id="input-with-icon-grid"
                fullWidth={true}
                onChange={e => {
                  setQuery(e.target.value);
                }}
                value={query}
                type="text"
              />
              <Button type="submit" variant="contained" color="primary">
                <SearchIcon />
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
      {loading || error ? (
        <InfoCard title="Searching..." variant={variant}>
          {loading && <Progress />}

          {!loading && error && (
            <EmptyState
              missing="info"
              title="No information to display"
              description={`There is no Sentry project with id '${query}'.`}
            />
          )}
        </InfoCard>
      ) : value ? (
        <SourcegraphSearchResultsTable
          searchResults={value || []}
          query={query}
        />
      ) : (
        <></>
      )}
    </>
  );
};
