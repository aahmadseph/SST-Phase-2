import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/homepageUgcWidget/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { HOMEPAGE_UGC_WIDGET_EXPERIENCE } from 'constants/TestTarget';

const showHomepageUgcWidgetSelector = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === HOMEPAGE_UGC_WIDGET_EXPERIENCE.CHALLENGER_ONE,
    challengerTwo: testReady && experience === HOMEPAGE_UGC_WIDGET_EXPERIENCE.CHALLENGER_TWO
}));

export { showHomepageUgcWidgetSelector };
