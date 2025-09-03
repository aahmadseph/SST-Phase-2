import SddSection from 'components/RwdCheckout/Sections/SddSections/SddSection/SddSection';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorUtils from 'utils/Errors';
import { globalErrorsSelector } from 'viewModel/selectors/global/globalSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import OrderUtils from 'utils/Order';
import React from 'react';
import SameDaySkuOOSException from 'components/RwdCheckout/Sections/SddSections/SddSection/SameDaySkuOOSException';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Empty from 'constants/empty';

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

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/SddSections/SddSection/locales', 'SddSection');

const errorSelector = createSelector(
    createStructuredSelector({
        oosError: getTextFromResource(getText, 'oosError'),
        oosBasket: getTextFromResource(getText, 'oosBasket'),
        oosUpdate: getTextFromResource(getText, 'oosUpdate')
    }),
    globalErrorsSelector,
    ({ oosError, oosBasket, oosUpdate }, globalErrors) => {
        let error = null;
        const keys = Object.keys(globalErrors).filter(key => {
            const { errorId, errorKey } = globalErrors[key];
            const result = showInlineGlobalError(errorId, errorKey);

            return result;
        });

        if (keys.length) {
            const key = keys[keys.length - 1];

            switch (key) {
                case SAME_DAY_SKU_OOS_EXCEPTION: {
                    error = (
                        <SameDaySkuOOSException
                            oosBasket={oosBasket}
                            oosUpdate={oosUpdate}
                            oosError={oosError}
                        />
                    );

                    break;
                }
                default: {
                    error = globalErrors[key].message;

                    break;
                }
            }
        }

        return error;
    }
);

const withSddSectionProps = connect(
    createSelector(
        createStructuredSelector({
            sduTitle: getTextFromResource(getText, 'sameDayUnlimited')
        }),
        shippingGroupsEntriesSelector,
        errorSelector,
        orderSelector,
        userSubscriptionsSelector,
        ({ sduTitle }, shippingGroupsEntries, errorMessage, order, userSubscriptions) => {
            const { shippingGroup: { sameDayTitle: title } = {} } =
                shippingGroupsEntries.find(group => group.shippingGroupType === SAME_DAY) || Empty.Object;
            const error = errorMessage || order.scheduledAddrChangeMessage;
            const isSDUOrderOnly = isSDUOnlyOrder(order.orderDetails);
            const isSDUInSddBasketOnly = hasSDUOnlyInSddBasket(order.orderDetails);
            const sameDayDeliveryBasket = OrderUtils.getSameDayDeliveryBasket(order.orderDetails);
            const isSDUInBasket = sameDayDeliveryBasket.items?.filter(item => item.sku.type === 'SDU').length > 0;
            const isUserSDUMember = userSubscriptions[0]?.status.startsWith('ACTIVE');
            const subTitle = '';
            const deliveryInfo = '';
            const promiseDateInfo = {};
            const displaySDUDeliveryPrice = isSDUInBasket || isUserSDUMember;

            return {
                deliveryInfo,
                error,
                promiseDateInfo,
                subTitle,
                isSDUInBasket,
                title: isSDUOrderOnly || isSDUInSddBasketOnly ? sduTitle : title,
                isDeliveryVisible: !isSDUOrderOnly && !isSDUInSddBasketOnly,
                isUserSDUMember,
                displaySDUDeliveryPrice
            };
        }
    )
);

const SddSectionWithProps = withSddSectionProps(SddSection);

export default SddSectionWithProps;
