import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const purchasedFlagOnGridPagesSelector = createSelector(testTargetOffersSelector, offers => offers.purchasedFlagOnGridPages || Empty.Object);

export { purchasedFlagOnGridPagesSelector };
