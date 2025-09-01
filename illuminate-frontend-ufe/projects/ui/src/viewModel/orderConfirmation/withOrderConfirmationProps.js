import AddToBasketActions from 'actions/AddToBasketActions';
import OrderUtils from 'utils/Order';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import itemsByBasketSelector from 'selectors/order/orderDetails/items/itemsByBasket/itemsByBasketSelector';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { isSplitEDDEnabledSelector } from 'viewModel/selectors/checkout/isSplitEDDEnabled/isSplitEDDEnabledSelector';

const {
    SHIPPING_GROUPS: { SAME_DAY, SDU_ELECTRONIC }
} = OrderUtils;

const {
    BASKET_TYPES: { SAMEDAY_BASKET, STANDARD_BASKET }
} = AddToBasketActions;

const withOrderConfirmationProps = connect(
    createSelector(
        itemsByBasketSelector,
        shippingGroupsEntriesSelector,
        orderDetailsSelector,
        isSplitEDDEnabledSelector,
        (itemsByBasket = [], shippingGroupsEntries = [], orderDetails, isSplitEDDEnabled) => {
            const sddBasket = itemsByBasket.find(item => item.basketType === SAMEDAY_BASKET) || {};
            const sddBasketHasItems = (sddBasket.items || []).length > 0;
            const standardBasket = itemsByBasket.find(item => item.basketType === STANDARD_BASKET) || {};
            const standardBasketHasItems = (standardBasket.items || []).length > 0;
            const isStandardAndSdd = sddBasketHasItems && standardBasketHasItems;
            const { shippingGroup: { items: sameDayItems = [] } = {} } =
                shippingGroupsEntries.find(group => group.shippingGroupType === SAME_DAY) || {};
            const { shippingGroup: { items: sduItem = [] } = {} } =
                shippingGroupsEntries.find(group => group.shippingGroupType === SDU_ELECTRONIC) || {};
            const showSDUBanner = Array.isArray(sameDayItems) && sameDayItems?.length > 0 && sduItem?.length > 0;
            const isSDUTrial = orderDetails.header.sduOrderType === 0;

            return {
                sddBasketHasItems,
                standardBasketHasItems,
                showSDUBanner,
                isSDUTrial,
                isStandardAndSdd,
                isSplitEDDEnabled
            };
        }
    )
);

export default withOrderConfirmationProps;
