import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/reorderCarouselHPSI/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { SHOW_REORDER_CAROUSEL_HPSI } from 'constants/TestTarget';

const showReorderCarouselHPSISelector = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === SHOW_REORDER_CAROUSEL_HPSI.CHALLENGER_ONE,
    challengerTwo: testReady && experience === SHOW_REORDER_CAROUSEL_HPSI.CHALLENGER_TWO,
    challengerThree: testReady && experience === SHOW_REORDER_CAROUSEL_HPSI.CHALLENGER_THREE,
    challengerFour: testReady && experience === SHOW_REORDER_CAROUSEL_HPSI.CHALLENGER_FOUR,
    challengerFive: testReady && experience === SHOW_REORDER_CAROUSEL_HPSI.CHALLENGER_FIVE
}));

export { showReorderCarouselHPSISelector };
