import { createSelector } from 'reselect';
import Empty from 'constants/empty';

// Select the main state slice
const mainStateSelector = state => state.page?.taxClaim || Empty.Object;

// Create a selector to access categoryTypes
const categoryTypesErrorSelector = createSelector(mainStateSelector, taxClaim => taxClaim?.categoryTypesError || Empty.Object);

export { categoryTypesErrorSelector };
