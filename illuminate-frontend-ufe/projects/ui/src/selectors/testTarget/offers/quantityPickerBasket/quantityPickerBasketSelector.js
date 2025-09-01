import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const quantityPickerBasketSelector = createSelector(testTargetOffersSelector, offers => offers.quantityPickerBasket || Empty.Object);

export { quantityPickerBasketSelector };
