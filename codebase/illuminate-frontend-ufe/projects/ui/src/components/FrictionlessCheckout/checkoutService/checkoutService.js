import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import checkoutApi from 'services/api/checkout';
import ErrorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import locationUtils from 'utils/Location';
import orderUtils from 'utils/Order';
import UtilActions from 'utils/redux/Actions';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import pazeUtils from 'utils/Paze.js';
import Venmo from 'utils/Venmo';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import utilityApi from 'services/api/utility';
import EditDataActions from 'actions/EditDataActions';
import FormsUtils from 'utils/Forms';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const authorizationGetText = getLocaleResourceFile('components/RwdCheckout/PlaceOrderButton/locales', 'PlaceOrderButton');

let isShippingRequestInProgress = false;
let getShippingMethodPromise = false;
const getShippingMethods = (orderId, shippingGroupId) => {
    if (!isShippingRequestInProgress) {
        isShippingRequestInProgress = true;
        getShippingMethodPromise = checkoutApi
            .getAvailableShippingMethods(orderId, shippingGroupId)
            .then(shippingData => {
                store.dispatch(OrderActions.updateShippingMethods(shippingData.shippingMethods, shippingGroupId));
                isShippingRequestInProgress = false;
            })
            .catch(errorData => {
                ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                isShippingRequestInProgress = false;
            });
    }

    return getShippingMethodPromise;
};

const refreshCheckout = ({ isUpdateOrder = true, clearErrors = true } = {}) => {
    let getOrderDetails;
    let updateShippingMethods = false;

    if (isUpdateOrder) {
        getOrderDetails = () => {
            return decorators
                .withInterstice(
                    checkoutApi.getOrderDetails,
                    INTERSTICE_DELAY_MS
                )(orderUtils.getOrderId())
                .then(newOrderDetails => {
                    const isZeroCheckout = orderUtils.isZeroCheckout();
                    const isSDUOnlyOrder = orderUtils.isSDUOnlyOrder(newOrderDetails);
                    const hasRRC = orderUtils.hasRRC(newOrderDetails);
                    const { isBopisOrder } = newOrderDetails.header;

                    //UC-388 We do not have to update Shipping methods if the order belongs to any of these cases.
                    if ((!isZeroCheckout || (isZeroCheckout && hasRRC)) && !isBopisOrder) {
                        updateShippingMethods = true;
                    }

                    if (updateShippingMethods) {
                        const shippingGroupEntries = newOrderDetails.shippingGroups.shippingGroupsEntries;
                        let shippingGroup;

                        if (locationUtils.isCheckoutGiftCardShipping()) {
                            const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(newOrderDetails);
                            shippingGroup = physicalGiftCardShippingGroup ?? shippingGroupEntries[0].shippingGroup;
                        } else {
                            shippingGroup = shippingGroupEntries[0].shippingGroup;
                        }

                        if (!isSDUOnlyOrder) {
                            getShippingMethods(newOrderDetails.header.orderId, shippingGroup.shippingGroupId);
                        }
                    }

                    clearErrors && store.dispatch(OrderActions.clearCheckoutSectionErrors());

                    store.dispatch(OrderActions.updateOrder(newOrderDetails));
                });
        };
    } else {
        getOrderDetails = () => Promise.resolve();
    }

    return getOrderDetails;
};

const getAddressList = (profileId, shipCountry) => {
    return checkoutApi
        .getAddressBook(profileId, shipCountry)
        .then(addressBook => {
            store.dispatch(UtilActions.merge('order', 'addressList', addressBook.addressList));
            store.dispatch(OrderActions.updateAddressListWithHalAddress());
        })
        .catch(errorData => {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
        });
};

const checkSelectedPayment =
    (paymentOptions, availablePaymentMethods) =>
        ({ orderDetails, checkoutPath = 'checkout' }) => {
        // keep Klarna selected in order to be able to restore the option
        // when user gets back to the Payment Section

            const { isAfterpayEnabledForThisOrder, isKlarnaEnabledForThisOrder, isPazeEnabledForThisOrder, isVenmoEnabledForThisOrder } =
            availablePaymentMethods;

            const isKlarnaSelected = orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.KLARNA) && isKlarnaEnabledForThisOrder;
            store.dispatch(KlarnaActions.toggleSelect(!!isKlarnaSelected));

            // keep Afterpay selected in order to be able to restore the option
            // when user gets back to the Payment Section
            // eslint-disable-next-line max-len
            const isAfterpaySelected = orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.AFTERPAY) && isAfterpayEnabledForThisOrder;
            store.dispatch(AfterpayActions.toggleSelect(!!isAfterpaySelected));

            // keep Paze selected in order to be able to restore the option
            // when user gets back to the Payment Section
            const isPazeSelected = orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.PAZE) && isPazeEnabledForThisOrder;
            store.dispatch(PazeActions.toggleSelect(!!isPazeSelected));

            const isVenmoSelected = orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.VENMO) && isVenmoEnabledForThisOrder;
            store.dispatch(VenmoActions.toggleSelect(!!isVenmoSelected));

            if (isAfterpaySelected && checkoutPath === 'checkout') {
                store.dispatch(AfterpayActions.setReady(true));
            }

            if (isKlarnaSelected && checkoutPath === 'checkout') {
                const errorMessage = authorizationGetText('authorizeErrorMessage', ['Klarna']);
                store.dispatch(KlarnaActions.backgroundInit(errorMessage));
            }

            if (isPazeSelected && checkoutPath === 'checkout') {
                store.dispatch(PazeActions.loadIframe(true));
                pazeUtils.initCheckoutWidget();
            }

            if (isVenmoSelected && checkoutPath === 'checkout') {
                Venmo.initializeVenmoCheckout();
            }
        };

const payPalWithInterstice = payload => {
    return decorators.withInterstice(checkoutApi.updatePayPalCheckout, INTERSTICE_DELAY_MS)(payload, 'update');
};

const getBillingCountries = () => {
    utilityApi.getCountryList().then(billingCountries => {
        store.dispatch(EditDataActions.updateEditData(billingCountries, FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST));
    });
};

const getCreditCards = orderId => {
    return checkoutApi
        .getCreditCards(orderId)
        .then(payments => {
            store.dispatch(UtilActions.merge('order', 'paymentOptions', payments));
        })
        .catch(errorData => {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
        });
};

export {
    refreshCheckout, getShippingMethods, getAddressList, checkSelectedPayment, payPalWithInterstice, getBillingCountries, getCreditCards
};
