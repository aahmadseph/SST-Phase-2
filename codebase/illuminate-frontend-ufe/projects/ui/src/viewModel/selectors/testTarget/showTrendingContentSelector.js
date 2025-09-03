import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/trendingContent/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { TRENDING_CONTENT } from 'constants/TestTarget';

const showTrendingContentSelector = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === TRENDING_CONTENT.CHALLENGER_ONE
}));

export { showTrendingContentSelector };
