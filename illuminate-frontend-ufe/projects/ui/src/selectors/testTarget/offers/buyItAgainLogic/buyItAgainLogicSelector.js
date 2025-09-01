import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const buyItAgainLogicSelector = createSelector(testTargetOffersSelector, offers => offers.buyItAgainLogic || Empty.Object);

export { buyItAgainLogicSelector };
