import { createSelector } from 'reselect';
import { reorderCarouselHPSOSelector } from 'selectors/testTarget/offers/reorderCarouselHPSO/reorderCarouselHPSOSelector';

const experienceSelector = createSelector(reorderCarouselHPSOSelector, reorderCarouselHPSO => reorderCarouselHPSO.experience);

export { experienceSelector };
