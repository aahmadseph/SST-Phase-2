import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const swapGiftCardBiBenefitBasketSelector = createSelector(testTargetOffersSelector, offers => offers.swapGiftCardBiBenefitBasket || Empty.Object);

export { swapGiftCardBiBenefitBasketSelector };
