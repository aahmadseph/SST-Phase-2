import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import OrderUtils from 'utils/Order';
import LocaleUtils from 'utils/LanguageLocale';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';

const {
    SHIPPING_GROUPS: { SAME_DAY, HARD_GOOD, SDU_ELECTRONIC }
} = OrderUtils;
const emptyArray = [];
const getText = LocaleUtils.getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

const withDeliverToSectionProps = connect(
    createSelector(
        shippingGroupsEntriesSelector,
        () => getText('deliverTo'),
        (shippingGroupsEntries = emptyArray, title) => {
            const sameDayShippingGroup = shippingGroupsEntries.find(group => group.shippingGroupType === SAME_DAY);
            const hardGoodShippingGroup = shippingGroupsEntries.find(group => group.shippingGroupType === HARD_GOOD) || {};
            const sduShippingGroup = shippingGroupsEntries.find(group => group.shippingGroupType === SDU_ELECTRONIC) || {};
            const standardAndSDUInOrder = Object.keys(hardGoodShippingGroup).length !== 0 && Object.keys(sduShippingGroup).length !== 0;
            const { shippingGroup: { address } = {} } = standardAndSDUInOrder ? hardGoodShippingGroup : sameDayShippingGroup || {};

            return {
                address,
                title
            };
        }
    )
);

export default withDeliverToSectionProps;
