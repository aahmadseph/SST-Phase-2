import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const accountMenuBuyItAgainSelector = createSelector(testTargetOffersSelector, offers => offers.accountMenuBuyItAgain || Empty.Object);

export { accountMenuBuyItAgainSelector };
