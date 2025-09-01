import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const showBuyItAgainATBModalSelector = createSelector(testTargetOffersSelector, offers => offers.showBuyItAgainATBModal || Empty.Object);

export { showBuyItAgainATBModalSelector };
