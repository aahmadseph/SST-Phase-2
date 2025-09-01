import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createStructuredSelector, createSelector } from 'reselect';
import OrderUtils from 'utils/Order';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import orderLocaleSelector from 'selectors/order/orderDetails/header/orderLocale/orderLocaleSelector';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { userSelector } from 'selectors/user/userSelector';
import StatusMessage from 'components/OrderConfirmation/SddSections/SddSection/StatusMessage';

const {
    ROPIS_CONSTANTS: {
        ORDER_STATUS: { ACTIVE }
    },
    SHIPPING_GROUPS: { SAME_DAY, SDU_ELECTRONIC, HARD_GOOD }
} = OrderUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const emptyArray = [];
const emptyObject = {};
const getText = getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

const fields = createSelector(
    shippingGroupsEntriesSelector,
    orderLocaleSelector,
    orderItemsSelector,
    orderDetailsSelector,
    userSelector,
    createStructuredSelector({
        whatToExpectText: getTextFromResource(getText, 'whatToExpectText'),
        emailUpdatesText: getTextFromResource(getText, 'emailUpdatesText'),
        viewOrderLink: getTextFromResource(getText, 'viewOrderLink'),
        viewOrderText: getTextFromResource(getText, 'viewOrderText'),
        viewOrderTextForSDU: getTextFromResource(getText, 'viewOrderTextForSDU'),
        mixedBasketGiftMessageSdd1: getTextFromResource(getText, 'mixedBasketGiftMessageSdd1'),
        mixedBasketGiftMessageSdd2: getTextFromResource(getText, 'mixedBasketGiftMessageSdd2')
    }),
    (shippingGroupsEntries = emptyArray, orderLocale, orderItems, orderDetails, user, textResources) => {
        const {
            shippingGroup: {
                items: sameDayItems = emptyArray,
                priceInfo: sddItemsPriceInfo = emptyObject,
                sameDayOrderStates = emptyArray,
                shippingMethod = emptyObject
            } = {}
        } = shippingGroupsEntries.find(group => group.shippingGroupType === SAME_DAY) || {};
        const { shippingGroup: { items: sduItem = emptyArray } = {} } =
            shippingGroupsEntries.find(group => group.shippingGroupType === SDU_ELECTRONIC) || {};
        const { shippingGroup: { items: standardItems = emptyArray } = {} } =
            shippingGroupsEntries.find(group => group.shippingGroupType === HARD_GOOD) || {};
        const sddItems = [...sduItem, ...sameDayItems];
        const isSDUInOrder = sduItem?.length > 0;
        const onlySDUInOrder = sameDayItems.length === 0 && standardItems.length === 0 && isSDUInOrder;
        const standardAndSDUInOrder = (standardItems?.length > 0 && isSDUInOrder) || onlySDUInOrder;
        const standardAndSddInOrder = standardItems?.length > 0 && sddItems?.length > 0;
        const deliveryInfo = shippingMethod?.sameDayDeliveryLabel;
        const title = standardAndSDUInOrder ? sduItem[0]?.product?.displayName : shippingMethod?.sameDayTitle;
        const orderStates = sameDayOrderStates.map(s => {
            if (s.status === ACTIVE) {
                return {
                    ...s,
                    stateMessages: [{ statusMessageComponent: StatusMessage }]
                };
            }

            return s;
        });
        const sduListPrice = sduItem[0]?.sku?.listPrice;
        const skuTrialPeriod = orderItems?.SDUProduct?.skuTrialPeriod;
        const sduRenewDate = dateUtils.getDateInMMDDYYYYShortMonth(sduItem[0]?.replenishmentPaymentDate);
        const isSDUTrial = orderDetails.header.sduOrderType === 0;
        const digitalGiftMessageEmail = standardAndSddInOrder ? orderDetails?.digitalGiftMsg?.email : null;

        return {
            ...textResources,
            deliveryInfo,
            orderLocale,
            orderStates,
            sddItems,
            sddItemsPriceInfo: isSDUInOrder ? orderDetails.priceInfo : sddItemsPriceInfo,
            title,
            sduListPrice,
            skuTrialPeriod,
            isSDUInOrder,
            sduRenewDate,
            standardAndSDUInOrder,
            isSDUTrial,
            digitalGiftMessageEmail
        };
    }
);

const withSddSectionProps = wrapHOC(connect(fields));

export {
    withSddSectionProps, fields
};
