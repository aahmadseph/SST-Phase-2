import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import OrderUtils from 'utils/Order';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import LocaleUtils from 'utils/LanguageLocale';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';

const {
    SHIPPING_GROUPS: { GIFT, HARD_GOOD, SAME_DAY },
    hasSDUInBasket
} = OrderUtils;

const emptyArray = [];
const emptyString = '';
const emptyObject = {};
const getText = LocaleUtils.getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

const withShippingGroupsProps = connect(
    createSelector(
        shippingGroupsEntriesSelector,
        orderDetailsSelector,
        () => getText('shipmentText', ['{0}']).toUpperCase(),
        (shippingGroupsEntries = emptyArray, orderDetails, shippingGroupTitle) => {
            const standardShippingGroupsEntries = shippingGroupsEntries.filter(entry => entry.shippingGroupType !== SAME_DAY);
            const multipleShippingGroups = standardShippingGroupsEntries.length > 1;
            const deliveryOnText = getText('deliveryOn');
            let giftItemsDeliveryOnDate = emptyString;
            let hardGoodItemsDeliveryOnDate = emptyString;
            let giftItemsPriceInfo = emptyObject;
            let hardGoodItemsPriceInfo = emptyObject;
            let giftItems = emptyArray;
            let hardGoodItems = emptyArray;

            shippingGroupsEntries.forEach(group => {
                switch (group.shippingGroupType) {
                    case GIFT: {
                        giftItemsDeliveryOnDate = group.shippingGroup?.shippingMethod?.shippingMethodDescription;
                        giftItems = group.shippingGroup?.items || emptyArray;
                        giftItemsPriceInfo = group.shippingGroup?.priceInfo || emptyObject;

                        break;
                    }
                    case HARD_GOOD: {
                        hardGoodItemsDeliveryOnDate = group.shippingGroup?.shippingMethod?.shippingMethodDescription;
                        hardGoodItems = group.shippingGroup?.items || emptyArray;
                        hardGoodItemsPriceInfo = group.shippingGroup?.priceInfo || emptyObject;

                        break;
                    }
                    default: {
                        // Do nothing
                    }
                }
            });

            return {
                deliveryOnText,
                giftItems,
                giftItemsDeliveryOnDate,
                giftItemsPriceInfo,
                hardGoodItems,
                hardGoodItemsDeliveryOnDate,
                hardGoodItemsPriceInfo,
                multipleShippingGroups,
                shippingGroupTitle,
                hasSDUInBasket: hasSDUInBasket(orderDetails)
            };
        }
    )
);

export default withShippingGroupsProps;
