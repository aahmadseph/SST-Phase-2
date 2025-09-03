import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import orderLocaleSelector from 'selectors/order/orderDetails/header/orderLocale/orderLocaleSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { isSplitEDDEnabledSelector } from 'viewModel/selectors/checkout/isSplitEDDEnabled/isSplitEDDEnabledSelector';
import Empty from 'constants/empty';
import checkoutUtils from 'utils/Checkout';
import dateUtils from 'utils/Date';
import OrderUtils from 'utils/Order';

const {
    isSDUOnlyOrder,
    SHIPPING_GROUPS: { SAME_DAY, SDU_ELECTRONIC }
} = OrderUtils;
const emptyArray = [];

const withSddSectionsProps = connect(
    createSelector(
        shippingGroupsEntriesSelector,
        orderLocaleSelector,
        priceInfoSelector,
        orderDetailsSelector,
        isSplitEDDEnabledSelector,
        (shippingGroupsEntries = emptyArray, orderLocale, priceInfo, orderDetails, isSplitEDDEnabled) => {
            const standardShippingGroupsEntries = shippingGroupsEntries.filter(
                entry => entry.shippingGroupType !== SAME_DAY && entry.shippingGroupType !== SDU_ELECTRONIC
            );
            const hasStandardItems = standardShippingGroupsEntries.length > 0;
            const hasSingleShippingGroupForStandardItems = standardShippingGroupsEntries.length === 1;
            const isSDUOrderOnly = isSDUOnlyOrder(orderDetails);
            const isSDUSubscription = orderDetails.header.sduOrderType === 0;
            const showSDUBISection = isSDUOrderOnly && isSDUSubscription;

            const hardGoodShippingGroup = OrderUtils.getHardGoodShippingGroup(orderDetails);
            const shippingMethod = hardGoodShippingGroup?.shippingMethod || Empty.Object;
            const showSplitEDD = isSplitEDDEnabled && checkoutUtils.hasDeliveryGroups([shippingMethod]);

            let promiseDateRangeLabel = null;
            let promiseDateRange = null;

            if (showSplitEDD) {
                promiseDateRangeLabel = shippingMethod?.promiseDateRangeLabel;
                promiseDateRange = dateUtils.getPromiseDateRange(shippingMethod?.promiseDateRange);
            }

            return {
                hasSingleShippingGroupForStandardItems,
                hasStandardItems,
                orderLocale,
                priceInfo,
                isSDUOrderOnly,
                showSDUBISection,
                promiseDateRangeLabel,
                promiseDateRange
            };
        }
    )
);

export default withSddSectionsProps;
