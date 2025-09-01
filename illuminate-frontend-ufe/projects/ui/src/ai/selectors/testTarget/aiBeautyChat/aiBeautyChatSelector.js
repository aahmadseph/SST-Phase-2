import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const aiBeautyChatSelector = createSelector(testTargetOffersSelector, offers => offers.showAIBeautyChat || Empty.Object);

export { aiBeautyChatSelector };
