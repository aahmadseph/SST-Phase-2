import { createSelector } from 'reselect';
import { nthCategorySelector } from 'selectors/page/nthCategory/nthCategorySelector';

const nthCategoryIdSelector = createSelector(nthCategorySelector, nthCategory => nthCategory.categoryId);

export default { nthCategoryIdSelector };
