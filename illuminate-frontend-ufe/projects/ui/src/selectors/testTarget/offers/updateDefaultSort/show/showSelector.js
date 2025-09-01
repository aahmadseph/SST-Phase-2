import { createSelector } from 'reselect';
import { updateDefaultSortSelector } from 'selectors/testTarget/offers/updateDefaultSort/updateDefaultSortSelector';

const showSelector = createSelector(updateDefaultSortSelector, updateDefaultSort => !!updateDefaultSort.show);

export { showSelector };
