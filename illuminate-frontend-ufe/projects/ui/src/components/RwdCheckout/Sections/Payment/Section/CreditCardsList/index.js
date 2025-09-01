import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import CreditCardsList from 'components/RwdCheckout/Sections/Payment/Section/CreditCardsList/CreditCardsList';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import Actions from 'Actions';
import OrderActions from 'actions/OrderActions';
import UtilActions from 'utils/redux/Actions';
import RwdCheckoutActions from 'actions/RwdCheckoutActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import profileApi from 'services/api/profile';
import checkoutApi from 'services/api/checkout';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Section/locales', 'PaymentSection');

const localization = createStructuredSelector({
    removeCreditCard: getTextFromResource(getText, 'removeCreditCard'),
    areYouSureMessage: getTextFromResource(getText, 'areYouSureMessage'),
    remove: getTextFromResource(getText, 'remove'),
    cancel: getTextFromResource(getText, 'cancel'),
    expiredCreditCardMsg: getTextFromResource(getText, 'expiredCreditCardMsg'),
    edit: getTextFromResource(getText, 'edit'),
    gotIt: getTextFromResource(getText, 'gotIt'),
    cvc: getTextFromResource(getText, 'cvc'),
    moreInfoCvc: getTextFromResource(getText, 'moreInfoCvc')
});

const fields = createSelector(localization, orderDetailsSelector, (locales, orderDetails) => {
    return {
        locales,
        orderDetails
    };
});

const dispatchFunctions = {
    togglePlaceOrderDisabled: OrderActions.togglePlaceOrderDisabled,
    CreditCardListToggleCVC: RwdCheckoutActions.CreditCardListToggleCVC,
    showInfoModal: Actions.showInfoModal,
    updateOrder: OrderActions.updateOrder,
    merge: UtilActions.merge,
    showCVCInfoModal: OrderActions.showCVCInfoModal,
    swapPaypalToCredit: OrderActions.swapPaypalToCredit
};

const utilityFunctions = {
    removeCreditCardFromProfile: (profileId, creditCardId) => {
        return decorators.withInterstice(profileApi.removeCreditCardFromProfile, INTERSTICE_DELAY_MS)(profileId, creditCardId);
    },
    removeOrderPayment: (orderId, creditCardGroupId, creditCardId) => {
        return decorators.withInterstice(checkoutApi.removeOrderPayment, INTERSTICE_DELAY_MS)(orderId, creditCardGroupId, creditCardId);
    },
    getOrderDetails: orderId => {
        return decorators.withInterstice(checkoutApi.getOrderDetails, INTERSTICE_DELAY_MS)(orderId);
    },
    getCreditCards: (orderId, shipCountry, isFilterSelected) => {
        return decorators.withInterstice(checkoutApi.getCreditCards, INTERSTICE_DELAY_MS)(orderId, shipCountry, isFilterSelected);
    }
};

const withCreditCardsListProps = wrapHOC(
    connect(fields, dispatchFunctions, (stateProps, dispatchProps, ownProps) => ({
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        ...utilityFunctions
    }))
);

export default withCreditCardsListProps(CreditCardsList);
