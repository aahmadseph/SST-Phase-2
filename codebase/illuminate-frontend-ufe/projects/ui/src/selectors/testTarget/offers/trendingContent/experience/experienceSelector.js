import { createSelector } from 'reselect';
import { trendingContentSelector } from 'selectors/testTarget/offers/trendingContent/trendingContentSelector';

const experienceSelector = createSelector(trendingContentSelector, trendingContent => trendingContent.experience);

export { experienceSelector };
