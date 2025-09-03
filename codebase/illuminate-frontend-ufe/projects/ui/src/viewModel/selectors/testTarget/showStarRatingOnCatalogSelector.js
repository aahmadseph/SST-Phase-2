import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/starRatingOnCatalog/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { STAR_RATING_ON_CATALOG_EXPERIENCE } from 'constants/TestTarget';

const showStarRatingOnCatalogSelector = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === STAR_RATING_ON_CATALOG_EXPERIENCE.CHALLENGER_ONE,
    challengerTwo: testReady && experience === STAR_RATING_ON_CATALOG_EXPERIENCE.CHALLENGER_TWO,
    challengerThree: testReady && experience === STAR_RATING_ON_CATALOG_EXPERIENCE.CHALLENGER_THREE,
    challengerFour: testReady && experience === STAR_RATING_ON_CATALOG_EXPERIENCE.CHALLENGER_FOUR
}));

export { showStarRatingOnCatalogSelector };
