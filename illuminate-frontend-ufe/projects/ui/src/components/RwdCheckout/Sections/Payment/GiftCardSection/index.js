import GiftCardSection from 'components/RwdCheckout/Sections/Payment/GiftCardSection/GiftCardSection';
import withGlobalModals from 'hocs/withGlobalModals';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import { orderSelector } from 'selectors/order/orderSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import orderUtils from 'utils/Order';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import RwdCheckoutActions from 'actions/RwdCheckoutActions';
import checkoutApi from 'services/api/checkout';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import store from 'store/Store';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');

const localization = createStructuredSelector({
    moreInfoTitle: getTextFromResource(getText, 'moreInfoTitle'),
    giftCard: getTextFromResource(getText, 'giftCard'),
    howToUseCard: getTextFromResource(getText, 'howToUseCard'),
    cancelText: getTextFromResource(getText, 'cancelText'),
    cancelLink: getTextFromResource(getText, 'cancelLink'),
    addGiftCard: getTextFromResource(getText, 'addGiftCard')
});

const fields = createSelector(orderDetailsSelector, orderSelector, localization, (orderDetails, order, locale) => {
    const giftCardPaymentGroups = (orderDetails.paymentGroups.paymentGroupsEntries || []).filter(
        group => group.paymentGroupType === orderUtils.PAYMENT_GROUP_TYPE.GIFT_CARD
    );

    return {
        giftCardPaymentGroups,
        isPlaceOrderDisabled: order.isPlaceOrderDisabled,
        localization: locale
    };
});

const functions = () => ({
    giftCardApplied: comp => {
        store.dispatch(RwdCheckoutActions.giftCardApplied(comp));
    },
    updateOrder: orderData => {
        store.dispatch(OrderActions.updateOrder(orderData));
    },
    togglePlaceOrderDisabled: toggle => {
        store.dispatch(OrderActions.togglePlaceOrderDisabled(toggle));
    },
    getOrderDetails: data => {
        return decorators.withInterstice(checkoutApi.getOrderDetails, INTERSTICE_DELAY_MS)(data);
    },
    showMediaModal: Actions.showMediaModal
});

const withGiftCardSectionProps = wrapHOC(connect(fields, functions));

const ConnectedGiftCardSection = withGlobalModals(withGiftCardSectionProps(GiftCardSection));

export default ConnectedGiftCardSection;
