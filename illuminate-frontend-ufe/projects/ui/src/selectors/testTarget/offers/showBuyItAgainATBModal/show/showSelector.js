import { createSelector } from 'reselect';
import { showBuyItAgainATBModalSelector } from 'selectors/testTarget/offers/showBuyItAgainATBModal/showBuyItAgainATBModalSelector';

const showSelector = createSelector(showBuyItAgainATBModalSelector, showBuyItAgainATBModal => !!showBuyItAgainATBModal.show);

export default { showSelector };
