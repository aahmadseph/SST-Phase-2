const GIFT_CARD_MSG_MAX_LENGTH = 125;
const INTERSTICE_DELAY_MS = 1000; //1000 ms delay for interstice for checkout,

const PAYMENT_LOGO_SIZE = {
    width: 50,
    height: 32
};

const PAYMENT_ERROR_CODES = [
    413, // paymentServiceError
    416, // generalPaymentServiceError
    420 //  createPaymentError
];

const DELIVERY_ISSUES_MODAL = {
    somethingWrongMessageScreen: 'SomethingWrongMessageScreen',
    universalSorryMessageScreen: 'UniversalSorryMessageScreen',
    eligibleForReplacementScreen: 'EligibleForReplacementScreen'
};

const PAZE_ERROR_MESSAGES = {
    incompleteCheckout: 'INCOMPLETE_CHECKOUT',
    inaccesible: 'ACCT_INACCESSIBLE',
    invalidData: 'CLIENT_DATA_INVALID'
};

export {
    DELIVERY_ISSUES_MODAL, GIFT_CARD_MSG_MAX_LENGTH, INTERSTICE_DELAY_MS, PAYMENT_LOGO_SIZE, PAYMENT_ERROR_CODES, PAZE_ERROR_MESSAGES
};
