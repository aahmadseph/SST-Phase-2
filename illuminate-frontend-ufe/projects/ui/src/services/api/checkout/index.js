// This module provides API call methods for Sephora Commerce Checkout APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Checkout+APIs
import addAlternatePickupPerson from 'services/api/checkout/addAlternatePickupPerson';
import addCreditCardToOrder from 'services/api/checkout/creditCards/addCreditCardToOrder';
import applyGiftCard from 'services/api/checkout/giftCards/applyGiftCard';
import cancelOrder from 'services/api/checkout/cancelOrder';
import createShippingAddress from 'services/api/checkout/addresses/createShippingAddress';
import getAddressBook from 'services/api/checkout/addresses/getAddressBook';
import getAvailableShippingMethods from 'services/api/checkout/addresses/getAvailableShippingMethods';
import getCreditCards from 'services/api/checkout/creditCards/getCreditCards';
import getGuestOrderDetails from 'services/api/checkout/getGuestOrderDetails';
import getOrderDetails from 'services/api/checkout/getOrderDetails';
import getPayPalToken from 'services/api/checkout/getPayPalToken';
import getReturnEligibility from 'services/api/checkout/getReturnEligibility';
import getReturnReasons from 'services/api/checkout/getReturnReasons';
import getSamedaySchedules from 'services/api/checkout/getSamedaySchedules';
import initializePaymentGroup from 'services/api/checkout/initializePaymentGroup';
import initializeAnonymousCheckout from 'services/api/checkout/initializeAnonymousCheckout';
import initializeCheckout from 'services/api/checkout/initializeCheckout';
import initializeKlarnaCheckout from 'services/api/checkout/initializeKlarnaCheckout';
import initializePaymentMethod from 'services/api/checkout/initializePaymentMethod';
import initializePayPalCheckout from 'services/api/checkout/initializePayPalCheckout';
import initializeVenmoCheckout from 'services/api/checkout/initializeVenmoCheckout';
import placeOrder from 'services/api/checkout/placeOrder';
import removeAlternatePickupPerson from 'services/api/checkout/removeAlternatePickupPerson';
import removeGiftCard from 'services/api/checkout/giftCards/removeGiftCard';
import removeOrderPayment from 'services/api/checkout/creditCards/removeOrderPayment';
import removeOrderShippingAddress from 'services/api/checkout/addresses/removeOrderShippingAddress';
import setShippingMethod from 'services/api/checkout/addresses/setShippingMethod';
import updateAlternatePickupPerson from 'services/api/checkout/updateAlternatePickupPerson';
import updateCreditCardOnOrder from 'services/api/checkout/creditCards/updateCreditCardOnOrder';
import updateDeliveryInstructions from 'services/api/checkout/updateDeliveryInstructions';
import updatePayPalCheckout from 'services/api/checkout/updatePayPalCheckout';
import updateShippingAddress from 'services/api/checkout/addresses/updateShippingAddress';
import validateApplePayMerchant from 'services/api/checkout/validateApplePayMerchant';
import getAccessPoints from 'services/api/checkout/accessPoints/getAccessPoints';
import getAccessPointHours from 'services/api/checkout/accessPoints/getAccessPointHours';
import setPickupMethod from 'services/api/checkout/setPickupMethod';
import setSmsSignup from 'services/api/checkout/setSmsSignup';
import getOrderHeader from 'services/api/checkout/getOrderHeader';
import checkHazmatLocation from 'services/api/checkout/checkHazmatLocation';
import getVenmoToken from 'services/api/checkout/getVenmoToken';

export default {
    addAlternatePickupPerson,
    addCreditCardToOrder,
    applyGiftCard,
    cancelOrder,
    createShippingAddress,
    getAddressBook,
    getAvailableShippingMethods,
    getCreditCards,
    getGuestOrderDetails,
    getOrderDetails,
    getPayPalToken,
    getVenmoToken,
    getReturnEligibility,
    getReturnReasons,
    getSamedaySchedules,
    initializePaymentGroup,
    initializeAnonymousCheckout,
    initializeCheckout,
    initializeKlarnaCheckout,
    initializePaymentMethod,
    initializePayPalCheckout,
    initializeVenmoCheckout,
    placeOrder,
    removeAlternatePickupPerson,
    removeGiftCard,
    removeOrderPayment,
    removeOrderShippingAddress,
    setShippingMethod,
    setPickupMethod,
    updateAlternatePickupPerson,
    updateCreditCardOnOrder,
    updateDeliveryInstructions,
    updatePayPalCheckout,
    updateShippingAddress,
    validateApplePayMerchant,
    getAccessPoints,
    getAccessPointHours,
    setSmsSignup,
    getOrderHeader,
    checkHazmatLocation
};
