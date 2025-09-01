import { createSelector } from 'reselect';
import Empty from 'constants/empty';

// Select the main state slice
const mainStateSelector = state => state.page?.taxClaim || Empty.Object;

// Create a selector to access step4VariationData
const step4VariationDataSelector = createSelector(mainStateSelector, taxClaim => taxClaim.step4VariationData || Empty.Object);

export { step4VariationDataSelector };
