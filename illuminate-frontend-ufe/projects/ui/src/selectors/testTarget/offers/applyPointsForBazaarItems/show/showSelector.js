import { createSelector } from 'reselect';
import { applyPointsForBazaarItemsSelector } from 'selectors/testTarget/offers/applyPointsForBazaarItems/applyPointsForBazaarItemsSelector';

const showSelector = createSelector(applyPointsForBazaarItemsSelector, applyPointsForBazaarItems => !!applyPointsForBazaarItems.show);

export { showSelector };
