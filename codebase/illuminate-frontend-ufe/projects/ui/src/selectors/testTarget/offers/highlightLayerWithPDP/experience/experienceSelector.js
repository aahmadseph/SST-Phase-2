import { createSelector } from 'reselect';
import { highlightLayerWithPDPSelector } from 'selectors/testTarget/offers/highlightLayerWithPDP/highlightLayerWithPDPSelector';

const experienceSelector = createSelector(highlightLayerWithPDPSelector, highlightLayerWithPDP => highlightLayerWithPDP.experience);

export { experienceSelector };
