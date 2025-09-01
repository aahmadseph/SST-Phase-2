import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/reorderCarouselHPSO/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { SHOW_REORDER_CAROUSEL_HPSO } from 'constants/TestTarget';

const showReorderCarouselHPSOSelector = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === SHOW_REORDER_CAROUSEL_HPSO.CHALLENGER_ONE,
    challengerTwo: testReady && experience === SHOW_REORDER_CAROUSEL_HPSO.CHALLENGER_TWO,
    challengerThree: testReady && experience === SHOW_REORDER_CAROUSEL_HPSO.CHALLENGER_THREE,
    challengerFour: testReady && experience === SHOW_REORDER_CAROUSEL_HPSO.CHALLENGER_FOUR,
    challengerFive: testReady && experience === SHOW_REORDER_CAROUSEL_HPSO.CHALLENGER_FIVE
}));

export { showReorderCarouselHPSOSelector };
