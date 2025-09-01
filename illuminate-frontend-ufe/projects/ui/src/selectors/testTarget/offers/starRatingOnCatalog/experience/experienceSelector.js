import { createSelector } from 'reselect';
import { starRatingOnCatalogSelector } from 'selectors/testTarget/offers/starRatingOnCatalog/starRatingOnCatalogSelector';

const experienceSelector = createSelector(starRatingOnCatalogSelector, starRatingOnCatalog => starRatingOnCatalog.experience);

export { experienceSelector };
