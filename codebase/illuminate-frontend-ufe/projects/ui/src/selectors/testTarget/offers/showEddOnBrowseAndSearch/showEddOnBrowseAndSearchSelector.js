import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const showEddOnBrowseAndSearchSelector = createSelector(testTargetOffersSelector, offers => offers.showEddOnBrowseAndSearch || Empty.Object);

export { showEddOnBrowseAndSearchSelector };
