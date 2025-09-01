import { createSelector } from 'reselect';
import { nthCategoryChicletsInFilterSelector } from 'selectors/testTarget/offers/nthCategoryChicletsInFilter/nthCategoryChicletsInFilterSelector';

const showSelector = createSelector(nthCategoryChicletsInFilterSelector, nthCategoryChicletsInFilter => !!nthCategoryChicletsInFilter.show);

export { showSelector };
