const SDD_ERRORS = ['basket.samedayNotAvaialble', 'schedules.unavailable', 'location.not.available'];

const PAYMENT_ERRORS = [
    'payment.paypal.unavailable',
    'payment.applepay.unavailable',
    'payment.klarnaPayment.unavailable',
    'payment.klarnaPayment.notadded',
    'payment.klarnaPayment.notAuthorized',
    'payment.klarnaPayment.unavailable',
    'payment.default.invalid',
    'payment.default.restricted',
    'checkout.zeroorder.tempcard.used'
];

const BOPIS_PICKUP_ERRORS = ['basket.store.not.available', 'bopis.pref.store.empty'];

const SECTION_NAMES = {
    DELIVER_TO: 'Deliver_To',
    SHIPPING_METHOD: 'Shipping_Method',
    PAYMENT: 'Payment',
    BI_BENEFITS: 'Beauty_Insider_Benefits',
    SDD: 'Same-Day_Delivery',
    BOPIS_PICKUP_INFO: 'Pickup_Info',
    GIFT_CARD_DELIVERY: 'gift_card_delivery'
};

export {
    SDD_ERRORS, PAYMENT_ERRORS, BOPIS_PICKUP_ERRORS, SECTION_NAMES
};
