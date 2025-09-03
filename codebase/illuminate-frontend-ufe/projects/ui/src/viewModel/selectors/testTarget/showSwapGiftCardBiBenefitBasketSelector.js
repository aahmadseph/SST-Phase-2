import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/swapGiftCardBiBenefitBasket/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showSwapGiftCardBiBenefitBasketSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showSwapGiftCardBiBenefitBasketSelector };
