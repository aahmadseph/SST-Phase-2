import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const homepageUgcWidgetSelector = createSelector(testTargetOffersSelector, offers => offers.homepageUgcWidget || Empty.Object);

export { homepageUgcWidgetSelector };
