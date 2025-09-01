import { createSelector } from 'reselect';
import { purchasedFlagOnGridPagesSelector } from 'selectors/testTarget/offers/purchasedFlagOnGridPages/purchasedFlagOnGridPagesSelector';

const experienceSelector = createSelector(purchasedFlagOnGridPagesSelector, purchasedFlagOnGridPages => purchasedFlagOnGridPages.experience);

export { experienceSelector };
