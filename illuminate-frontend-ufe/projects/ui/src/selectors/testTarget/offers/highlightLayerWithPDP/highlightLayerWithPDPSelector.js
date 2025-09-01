import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const highlightLayerWithPDPSelector = createSelector(testTargetOffersSelector, offers => offers.highlightLayerWithPDP || Empty.Object);

export { highlightLayerWithPDPSelector };
