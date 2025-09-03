import { createSelector } from 'reselect';
import { buyItAgainLogicSelector } from 'selectors/testTarget/offers/buyItAgainLogic/buyItAgainLogicSelector';

const showSelector = createSelector(buyItAgainLogicSelector, buyItAgainLogic => !!buyItAgainLogic.show);

export { showSelector };
