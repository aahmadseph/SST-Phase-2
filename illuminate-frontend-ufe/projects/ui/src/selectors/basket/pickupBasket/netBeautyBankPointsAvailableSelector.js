import { createSelector } from 'reselect';
import { pickupBasketSelector } from 'selectors/basket/pickupBasket/pickupBasketSelector';

const netBeautyBankPointsAvailableSelector = createSelector(pickupBasketSelector, pickupBasket => pickupBasket.netBeautyBankPointsAvailable);

export default { netBeautyBankPointsAvailableSelector };
