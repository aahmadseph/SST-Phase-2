import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import testTargetSelector from 'selectors/testTarget/testTargetSelector';

/**
 * Adobe Mbox offers selector( A/B test )
 * ref: https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=453083927
 */
const testTargetOffersSelector = createSelector(testTargetSelector, testTarget => testTarget.offers || Empty.Object);

export { testTargetOffersSelector };
