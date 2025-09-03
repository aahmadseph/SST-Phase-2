import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/purchasedFlagOnGridPages/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { PURCHASED_FLAG_ON_GRID_PAGES_EXPERIENCE } from 'constants/TestTarget';

const showPurchasedFlagOnGridPagesSelector = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === PURCHASED_FLAG_ON_GRID_PAGES_EXPERIENCE.CHALLENGER_ONE,
    challengerTwo: testReady && experience === PURCHASED_FLAG_ON_GRID_PAGES_EXPERIENCE.CHALLENGER_TWO
}));

export { showPurchasedFlagOnGridPagesSelector };
