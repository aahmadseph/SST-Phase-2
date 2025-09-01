import { createSelector } from 'reselect';
import { nthCategorySelector } from 'selectors/page/nthCategory/nthCategorySelector';

const firstLevelCategorySelector = createSelector(nthCategorySelector, nthCategory => nthCategory?.categories?.[0]);

export { firstLevelCategorySelector };
