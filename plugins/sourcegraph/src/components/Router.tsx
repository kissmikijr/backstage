import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { Route, Routes } from 'react-router';
import { SourcegraphSearchResultsWidget } from './SourcegraphSearchResultsWidget';

export const Router = ({ entity }: { entity: Entity }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<SourcegraphSearchResultsWidget entity={entity} />}
      />
      )
    </Routes>
  );
};
