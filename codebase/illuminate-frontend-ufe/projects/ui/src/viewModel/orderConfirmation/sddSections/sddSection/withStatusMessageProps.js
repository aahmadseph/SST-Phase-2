import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import BCCUtils from 'utils/BCC';
import Actions from 'actions/Actions';
import LanguageLocale from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import orderDetailsHeaderSelector from 'selectors/order/orderDetails/header/headerSelector';

const {
    SHIPPING_GROUPS: { SAME_DAY },
    ROPIS_CONSTANTS: {
        ORDER_STATUS: { ACTIVE }
    }
} = OrderUtils;
const {
    MEDIA_IDS: { SDD_FAQ }
} = BCCUtils;
const { showMediaModal: createShowMediaModalAction } = Actions;

const emptyArray = [];
const getText = LanguageLocale.getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

const onFAQLinkClicked = event => dispatch => {
    event.preventDefault();
    event.stopPropagation();

    const showMediaModalAction = createShowMediaModalAction({
        isOpen: true,
        mediaId: SDD_FAQ
    });
    dispatch(showMediaModalAction);
};

const withStatusMessageProps = connect(
    createSelector(shippingGroupsEntriesSelector, orderDetailsHeaderSelector, (shippingGroupsEntries = emptyArray, { sameDayOrderStatus }) => {
        const { shippingGroup: { sameDayOrderStates, trackingUrl } = {} } =
            shippingGroupsEntries.find(group => group.shippingGroupType === SAME_DAY) || {};
        const {
            // The active state should have a message
            stateMessages
        } = sameDayOrderStates.find(s => s.status === ACTIVE);
        const isOnItsWay = sameDayOrderStatus === 'On Its Way';
        const showTracking = trackingUrl && isOnItsWay;
        const showFAQ = sameDayOrderStatus !== 'Delivered';

        return {
            tracking: showTracking
                ? {
                    URL: trackingUrl,
                    text: getText('trackYourOrder')
                }
                : null,
            faqText: showFAQ ? getText('seeFAQ') : null,
            messageText: isOnItsWay ? null : stateMessages[0].message
        };
    }),
    { onFAQLinkClicked }
);

export default withStatusMessageProps;
