import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import OrderUtils from 'utils/Order';
import LocaleUtils from 'utils/LanguageLocale';
import checkoutUtils from 'utils/Checkout';
import Empty from 'constants/empty';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import { isSplitEDDEnabledSelector } from 'viewModel/selectors/checkout/isSplitEDDEnabled/isSplitEDDEnabledSelector';

const {
    SHIPPING_GROUPS: { HARD_GOOD, SAME_DAY }
} = OrderUtils;
const emptyArray = [];
const emptyString = '';
const getText = LocaleUtils.getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

const withStandardSectionProps = connect(
    createSelector(
        shippingGroupsEntriesSelector,
        () => getText('standardShipping'),
        isSplitEDDEnabledSelector,
        (shippingGroupsEntries = emptyArray, title, isSplitEDDEnabled) => {
            const standardShippingGroupsEntries = shippingGroupsEntries.filter(entry => entry.shippingGroupType !== SAME_DAY);
            const { shippingGroup, shippingGroup: { shippingMethod: { shippingMethodDescription: deliveryInfo = emptyString } = {} } = {} } =
                standardShippingGroupsEntries.find(entry => entry.shippingGroupType === HARD_GOOD) || {};
            const multipleShippingGroups = standardShippingGroupsEntries.length > 1;
            const shippingMethod = shippingGroup?.shippingMethod || Empty.Object;
            const showSplitEDD = isSplitEDDEnabled && checkoutUtils.hasDeliveryGroups([shippingMethod]);

            return {
                deliveryInfo,
                multipleShippingGroups,
                title,
                shippingGroup,
                showSplitEDD
            };
        }
    )
);

export default withStandardSectionProps;
