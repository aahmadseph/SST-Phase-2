import { createSelector } from 'reselect';
import { showEddOnBrowseAndSearchSelector } from 'selectors/testTarget/offers/showEddOnBrowseAndSearch/showEddOnBrowseAndSearchSelector';

const showSelector = createSelector(showEddOnBrowseAndSearchSelector, showEddOnBrowseAndSearch => !!showEddOnBrowseAndSearch.show);

export default { showSelector };
