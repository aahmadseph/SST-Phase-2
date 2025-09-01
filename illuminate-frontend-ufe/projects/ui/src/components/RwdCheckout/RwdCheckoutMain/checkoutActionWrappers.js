import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import checkoutUtils from 'utils/Checkout';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import Venmo from 'utils/Venmo';
import pazeUtils from 'utils/Paze.js';
import orderUtils from 'utils/Order';
import LanguageLocaleUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = LanguageLocaleUtils;
import { SECTION_SAVED } from 'constants/actionTypes/order';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import Actions from 'actions/Actions';
import StringUtils from 'utils/String';

const authorizationGetText = getLocaleResourceFile('components/RwdCheckout/PlaceOrderButton/locales', 'PlaceOrderButton');

const CHECKOUT_SECTIONS = checkoutUtils.CHECKOUT_SECTIONS;
const CHECKOUT_PATH = checkoutUtils.CHECKOUT_PATH;

const resetAccessPoint = () => {
    store.dispatch(OrderActions.removeHalAddress());
    store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
};

const changeRoute = checkoutPath => {
    const path = `${CHECKOUT_PATH}/${checkoutPath}`;
    store.dispatch(historyLocationActions.goTo({ path }));
    store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
};

const createDraftHalAddress = (address, shippingGroupId, halOperatingHours) => {
    store.dispatch(OrderActions.createDraftHalAddress(address, shippingGroupId, halOperatingHours)).then(() => {
        changeRoute(CHECKOUT_SECTIONS.SHIP_ADDRESS.path);
    });
};

const checkSelectedPayment =
    paymentOptions =>
        ({ orderDetails, checkoutPath }, component) => {
        // keep Klarna selected in order to be able to restore the option
        // when user gets back to the Payment Section

            const isKlarnaSelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.KLARNA) && component.isKlarnaEnabledForThisOrder(orderDetails);
            store.dispatch(KlarnaActions.toggleSelect(!!isKlarnaSelected));

            // keep Afterpay selected in order to be able to restore the option
            // when user gets back to the Payment Section
            const isAfterpaySelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.AFTERPAY) && component.isAfterpayEnabledForThisOrder(orderDetails);
            store.dispatch(AfterpayActions.toggleSelect(!!isAfterpaySelected));

            // keep Paze selected in order to be able to restore the option
            // when user gets back to the Payment Section
            const isPazeSelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.PAZE) && component.isPazeEnabledForThisOrder(orderDetails);
            store.dispatch(PazeActions.toggleSelect(!!isPazeSelected));

            // keep Venmo selected in order to be able to restore the option
            // when user gets back to the Payment Section
            const isVenmoSelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.VENMO) && component.isVenmoEnabledForThisOrder(orderDetails);
            store.dispatch(VenmoActions.toggleSelect(!!isVenmoSelected));

            const afterpayIsDefault = paymentOptions?.defaultPayment === 'afterpay';
            const klarnaIsDefault = paymentOptions?.defaultPayment === 'klarna';

            if (isAfterpaySelected && afterpayIsDefault && checkoutPath === 'checkout') {
                store.dispatch(AfterpayActions.setReady(true));
            }

            if (isKlarnaSelected && klarnaIsDefault && checkoutPath === 'checkout') {
                const errorMessage = authorizationGetText('authorizeErrorMessage', ['Klarna']);
                store.dispatch(KlarnaActions.backgroundInit(errorMessage));
            }

            if (isPazeSelected && checkoutPath === 'checkout') {
                store.dispatch(PazeActions.loadIframe(true));
                pazeUtils.initCheckoutWidget();
            }

            if (isVenmoSelected && checkoutPath === 'checkout') {
                Venmo.prepareVenmoCheckout();
            }
        };

const orderReviewIsActive = isComplete => store.dispatch(OrderActions.orderReviewIsActive(isComplete));

const sectionSaveSubscription = comp => {
    return store.watchAction(SECTION_SAVED, action => {
        //if payment completeness has changed due to user checking play
        //terms and conditions we need to update this.state.isPaymentComplete
        if (!comp.state.isPaymentComplete && action.isPaymentSectionComplete) {
            comp.setState({ isPaymentComplete: action.isPaymentSectionComplete });
        }

        //need to update placeOrder button here since payment option has already been
        //chosen and user has now just checked terms and conditions and clicked
        //save and continue to move on (which should enable the subscribe button)
        checkoutUtils.disablePlaceOrderButtonBasedOnCheckoutCompleteness();

        if (Sephora.isAgent) {
            //If it is Sephora Mirror, independent of the agent role, when saving a Checkout section needs to open credit card section
            if (action.section !== `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.PAYMENT.path}`) {
                Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, true);
            }
        }

        comp.refreshCheckout({ isUpdateOrder: action.isUpdateOrder });
    });
};

const orderDetailChanges = (orderDetails, comp) => {
    comp.parseAndSetCheckoutState(orderDetails);
    const { promotionDiscount } = orderDetails.priceInfo;

    if (comp.sectionPath === CHECKOUT_SECTIONS.PAYMENT.path && comp.prevPromotionDiscount !== promotionDiscount) {
        comp.prevPromotionDiscount = promotionDiscount;
    } else {
        checkoutUtils.disablePlaceOrderButtonBasedOnCheckoutCompleteness();
    }

    const tmpCardMessage = orderUtils.getTempSephoraCardMessage();

    if (!orderUtils.isKlarnaEnabledForThisOrder(orderDetails) && comp.props.isKlarnaSelected) {
        store.dispatch(KlarnaActions.toggleSelect(false));
    }

    if (!orderUtils.isAfterpayEnabledForThisOrder(orderDetails) && comp.props.isAfterpaySelected) {
        store.dispatch(AfterpayActions.toggleSelect(false));
    }

    if (!orderUtils.isPazeEnabledForThisOrder(orderDetails) && comp.props.isPazeSelected) {
        store.dispatch(PazeActions.toggleSelect(false));
    }

    if (!orderUtils.isVenmoEnabledForThisOrder(orderDetails) && comp.props.isVenmoSelected) {
        store.dispatch(VenmoActions.toggleSelect(false));
    }

    if (tmpCardMessage) {
        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: StringUtils.capitalize(tmpCardMessage.type),
                message: tmpCardMessage.messages.join('. ')
            })
        );
    }
};

export {
    resetAccessPoint,
    changeRoute,
    createDraftHalAddress,
    checkSelectedPayment,
    orderReviewIsActive,
    sectionSaveSubscription,
    orderDetailChanges
};
