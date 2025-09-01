import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const highlightValuePriceOnPDPSelector = createSelector(testTargetOffersSelector, offers => offers.highlightValuePriceOnPDP || Empty.Object);

export { highlightValuePriceOnPDPSelector };
