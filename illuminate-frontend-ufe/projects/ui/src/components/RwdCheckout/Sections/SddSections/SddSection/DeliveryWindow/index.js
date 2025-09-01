import DeliveryWindow from 'components/RwdCheckout/Sections/SddSections/SddSection/DeliveryWindow/DeliveryWindow';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import LanguageLocale from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';
import userUtils from 'utils/User';
import store from 'Store';
import OrderActions from 'actions/OrderActions';
import checkoutApi from 'services/api/checkout';
import orderShippingMethodsSelector from 'selectors/order/orderShippingMethods/orderShippingMethodsSelector';
import Empty from 'constants/empty';
import Actions from 'Actions';

const { dispatch } = store;
const { updateOrder, showScheduledDeliveryUnavailable } = OrderActions;
const getText = LanguageLocale.getLocaleResourceFile('components/RwdCheckout/Sections/SddSections/SddSection/locales', 'SddSection');
const getDeliveryText = LanguageLocale.getLocaleResourceFile(
    'components/RwdCheckout/Sections/SddSections/SddSection/DeliveryWindow/locales',
    'DeliveryWindowOption'
);

const onDeliveryWindowSaved = () => {
    dispatch(showScheduledDeliveryUnavailable(false));
    checkoutApi.getOrderDetails(OrderUtils.getOrderId()).then(newOrderDetails => {
        dispatch(updateOrder(newOrderDetails));
    });
};

const { getTextFromResource } = LanguageLocale;

const withDeliveryWindowProps = connect(
    createSelector(
        orderDetailsSelector,
        shippingGroupsEntriesSelector,
        orderShippingMethodsSelector,
        createStructuredSelector({
            free: getTextFromResource(getDeliveryText, 'free'),
            errorTitle: getTextFromResource(getText, 'errorTitle'),
            ok: getTextFromResource(getText, 'ok')
        }),
        (orderDetails, shippingGroups, orderShippingMethods, { free, errorTitle, ok }) => {
            const { isScheduledSDDDeliveryEnabled } = orderDetails?.header;
            const sameDayShippingGroup =
                shippingGroups.find(group => group.shippingGroupType === OrderUtils.SHIPPING_GROUPS.SAME_DAY)?.shippingGroup || Empty.Object;
            const isDeliveryWindowScheduled =
                sameDayShippingGroup.shippingMethod?.shippingMethodType?.includes('Schedule') ||
                sameDayShippingGroup.shippingMethod?.shippingMethodType?.includes('Planifier');
            const sameDayShippingGroupId = sameDayShippingGroup.shippingGroupId;
            let shippingMethods;

            if (sameDayShippingGroup.availableShippingMethods) {
                shippingMethods = sameDayShippingGroup.availableShippingMethods;
            } else {
                for (const property in orderShippingMethods) {
                    if (orderShippingMethods[property]) {
                        const methods = orderShippingMethods[property];
                        const foundSameDayDelivery = OrderUtils.getSameDayShippingMethod(methods);

                        if (foundSameDayDelivery) {
                            shippingMethods = orderShippingMethods[property];
                        }
                    }
                }
            }

            const sameDayDeliveryMethod = shippingMethods ? shippingMethods[0] : Empty.Object;
            const sameDayDeliveryMethodId = sameDayDeliveryMethod?.shippingMethodId;
            const scheduledSameDayDeliveryMethod = shippingMethods ? shippingMethods[1] : Empty.Object;
            const scheduledSDDShippingMethodId = scheduledSameDayDeliveryMethod?.shippingMethodId;
            const { sameDayDeliveryLabel, sameDayDeliveryMessage } = sameDayDeliveryMethod;
            const deliveryWindowTitle = isDeliveryWindowScheduled
                ? `${scheduledSameDayDeliveryMethod.sameDayDeliveryMessage}, ${scheduledSameDayDeliveryMethod.sameDayDeliveryLabel}`
                : getText('deliveryWindowTitle');
            const deliveryWindowPrice = isScheduledSDDDeliveryEnabled && scheduledSameDayDeliveryMethod.shippingFee;
            const deliveryWindowMessage = !isScheduledSDDDeliveryEnabled
                ? getText('deliveryWindowUnavailable')
                : isDeliveryWindowScheduled
                    ? getText('chooseDifferentTime')
                    : '';

            const isSDDRougeFreeShipEligible = userUtils.isSDDRougeFreeShipEligible(); // kill-switch
            const isFreeRougeSameDayOrder = OrderUtils.isFreeRougeSameDayDelivery(sameDayDeliveryMethod);
            const isFreeRougeSDD = isSDDRougeFreeShipEligible && isFreeRougeSameDayOrder;
            const sameDayDeliveryBasket = OrderUtils.getSameDayDeliveryBasket(orderDetails);
            const isSDUInBasket = sameDayDeliveryBasket.items?.filter(item => item.sku.type === 'SDU').length > 0;
            const sameDayDeliveryPrice =
                isSDUInBasket && OrderUtils.isZeroPrice(sameDayDeliveryMethod.shippingFee) ? free : sameDayDeliveryMethod.shippingFee;
            const isFreeRougeSDDV2 = orderDetails.items.SDDRougeTestFreeShipping;

            const { showInfoModal } = Actions;

            return {
                sameDayDeliveryLabel,
                sameDayDeliveryMessage,
                sameDayDeliveryPrice,
                sameDayShippingGroupId,
                deliveryWindowTitle,
                deliveryWindowPrice,
                deliveryWindowMessage,
                isScheduledSDDDeliveryEnabled,
                scheduledSDDShippingMethodId,
                isDeliveryWindowScheduled,
                isFreeRougeSDD: isFreeRougeSDD || isFreeRougeSDDV2,
                sameDayDeliveryMethodId,
                errorTitle,
                ok,
                free,
                showInfoModal
            };
        }
    ),
    { onDeliveryWindowSaved /* onCloseDeliveryWindow  */ }
);

export default withDeliveryWindowProps(DeliveryWindow);
