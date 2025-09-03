import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const showSMNSelectorTarget = createSelector(testTargetOffersSelector, offers => offers.showSMN || Empty.Object);

export { showSMNSelectorTarget };
