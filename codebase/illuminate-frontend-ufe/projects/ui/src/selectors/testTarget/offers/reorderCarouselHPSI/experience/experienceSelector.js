import { createSelector } from 'reselect';
import { reorderCarouselHPSISelector } from 'selectors/testTarget/offers/reorderCarouselHPSI/reorderCarouselHPSISelector';

const experienceSelector = createSelector(reorderCarouselHPSISelector, reorderCarouselHPSI => reorderCarouselHPSI.experience);

export { experienceSelector };
