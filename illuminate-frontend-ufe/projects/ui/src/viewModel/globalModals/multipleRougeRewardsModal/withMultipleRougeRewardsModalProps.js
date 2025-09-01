import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import BasketPageSelector from 'selectors/page/rwdBasket/basketSelector';
const { basketPageSelector } = BasketPageSelector;
import promoSelector from 'selectors/promo/promoSelector';
import RwdBasketUtils from 'utils/RwdBasket';
const { getRemainingBalanceMessage } = RwdBasketUtils;
import * as RwdBasketConst from 'constants/RwdBasket';
const {
    BASKET_LEVEL_MESSAGES_CONTEXTS: { RRC_REMAINING_BALANCE }
} = RwdBasketConst;

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(basketPageSelector, promoSelector, ({ basket }, promo) => {
    return {
        appliedRougeRewards: basket?.appliedPromotions || [],
        rrcRemainingBalanceMessage: getRemainingBalanceMessage({
            basketLevelMessages: basket?.basketLevelMessages || [],
            messageContext: RRC_REMAINING_BALANCE
        }),
        promo
    };
});
const withMultipleRougeRewardsModalProps = wrapHOC(connect(fields));

export {
    fields, withMultipleRougeRewardsModalProps
};
