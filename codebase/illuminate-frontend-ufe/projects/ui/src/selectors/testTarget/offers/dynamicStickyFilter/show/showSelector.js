import { createSelector } from 'reselect';
import { dynamicStickyFilterSelector } from 'selectors/testTarget/offers/dynamicStickyFilter/dynamicStickyFilterSelector';

const showSelector = createSelector(dynamicStickyFilterSelector, dynamicStickyFilter => !!dynamicStickyFilter.show);

export { showSelector };
