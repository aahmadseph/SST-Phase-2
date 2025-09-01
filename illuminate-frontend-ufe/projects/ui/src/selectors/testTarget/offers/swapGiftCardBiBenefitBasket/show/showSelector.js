import { createSelector } from 'reselect';
import { swapGiftCardBiBenefitBasketSelector } from 'selectors/testTarget/offers/swapGiftCardBiBenefitBasket/swapGiftCardBiBenefitBasketSelector';

const showSelector = createSelector(swapGiftCardBiBenefitBasketSelector, swapGiftCardBiBenefitBasket => !!swapGiftCardBiBenefitBasket.show);

export { showSelector };
