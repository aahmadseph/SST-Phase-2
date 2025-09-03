import { createSelector } from 'reselect';
import { accountMenuBuyItAgainSelector } from 'selectors/testTarget/offers/accountMenuBuyItAgain/accountMenuBuyItAgainSelector';

const showSelector = createSelector(accountMenuBuyItAgainSelector, accountMenuBuyItAgain => !!accountMenuBuyItAgain.show);

export { showSelector };
