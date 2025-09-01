import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorUtils from 'utils/Errors';
import { globalErrorsSelector } from 'viewModel/selectors/global/globalSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import OrderUtils from 'utils/Order';
import React from 'react';
import SameDaySkuOOSException from 'components/FrictionlessCheckout/SddSection/SameDayException/SameDaySkuOOSException';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Actions from 'Actions';
import SddCard from 'components/FrictionlessCheckout/SddSection/SddCard/SddCard';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { showInlineGlobalError } = ErrorUtils;

const {
    SHIPPING_GROUPS: { SAME_DAY },
    isSDUOnlyOrder,
    hasSDUOnlyInSddBasket
} = OrderUtils;

const {
    ERROR_CODES: { SAME_DAY_SKU_OOS_EXCEPTION }
} = ErrorConstants;

const getText = getLocaleResourceFile('components/FrictionlessCheckout/SddSection/locales', 'SddSection');

const errorSelector = createSelector(globalErrorsSelector, globalErrors => {
    let error = null;
    let isSDDSkuOOSException = false;

    const keys = Object.keys(globalErrors).filter(key => {
        const { errorId, errorKey } = globalErrors[key];
        const result = showInlineGlobalError(errorId, errorKey);

        return result;
    });

    if (keys.length) {
        const key = keys[keys.length - 1];

        switch (key) {
            case SAME_DAY_SKU_OOS_EXCEPTION: {
                error = SameDaySkuOOSException;
                isSDDSkuOOSException = true;

                break;
            }
            default: {
                error = globalErrors[key].message;

                break;
            }
        }
    }

    return { error, isSDDSkuOOSException };
});

const functions = {
    showContentModal: Actions.showContentModal
};

const withSddSectionProps = connect(
    createSelector(
        createStructuredSelector({
            sduTitle: getTextFromResource(getText, 'sameDayUnlimited'),
            nextDayDelivery: getTextFromResource(getText, 'nextDayDelivery')
        }),
        shippingGroupsEntriesSelector,
        errorSelector,
        orderSelector,
        userSubscriptionsSelector,
        ({ sduTitle, nextDayDelivery }, shippingGroupsEntries, errorMessage, order, userSubscriptions) => {
            const sameDayShippingGroup = shippingGroupsEntries.find(group => group.shippingGroupType === SAME_DAY)?.shippingGroup || {};
            const error = errorMessage || order.scheduledAddrChangeMessage;
            const isSDUOrderOnly = isSDUOnlyOrder(order.orderDetails);
            const isSDUInSddBasketOnly = hasSDUOnlyInSddBasket(order.orderDetails);
            const sameDayDeliveryBasket = OrderUtils.getSameDayDeliveryBasket(order.orderDetails);
            const isSDUInBasket = sameDayDeliveryBasket.items?.filter(item => item.sku.type === 'SDU').length > 0;
            const isUserSDUMember = userSubscriptions[0].status.startsWith('ACTIVE');
            const subTitle = '';
            const deliveryInfo = '';
            const promiseDateInfo = {};
            const displaySDUDeliveryPrice = isSDUInBasket || isUserSDUMember;
            const isDeliveryWindowScheduled =
                sameDayShippingGroup.shippingMethod?.shippingMethodType?.includes('Schedule') ||
                sameDayShippingGroup.shippingMethod?.shippingMethodType?.includes('Planifier');
            const isNextDayDelivery = isDeliveryWindowScheduled
                ? sameDayShippingGroup?.sameDayDeliveryMessage?.includes('Tomorrow') ||
                  sameDayShippingGroup?.sameDayDeliveryMessage?.includes('Demain')
                : sameDayShippingGroup?.sameDayDeliveryLabel?.includes('tomorrow') || sameDayShippingGroup?.sameDayDeliveryLabel?.includes('demain');

            const title =
                isSDUOrderOnly || isSDUInSddBasketOnly ? sduTitle : isNextDayDelivery ? nextDayDelivery : sameDayShippingGroup?.sameDayTitle;
            const sectionLevelError = order.sectionErrors?.[SECTION_NAMES.SDD]?.length && order.sectionErrors?.[SECTION_NAMES.SDD];

            return {
                deliveryInfo,
                error,
                promiseDateInfo,
                subTitle,
                isSDUInBasket,
                title,
                isDeliveryVisible: !isSDUOrderOnly && !isSDUInSddBasketOnly,
                isUserSDUMember,
                displaySDUDeliveryPrice,
                isSDUOnlyOrder: isSDUOrderOnly || isSDUInSddBasketOnly,
                sectionLevelError
            };
        }
    ),
    functions
);

const SddCardWithProps = withSddSectionProps(SddCard);

export default SddCardWithProps;
