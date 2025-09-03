import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const updateDefaultSortSelector = createSelector(testTargetOffersSelector, offers => offers.updateDefaultSort || Empty.Object);

export { updateDefaultSortSelector };
