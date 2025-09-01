import { createSelector } from 'reselect';
import { catalogSelector } from 'selectors/catalog/catalogSelector';

const filterBarHiddenSelector = createSelector(catalogSelector, catalog => !!catalog.filterBarHidden);

export { filterBarHiddenSelector };
