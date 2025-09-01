export const PAYMENT_METHODS = {
    KLARNA: 'klarna',
    AFTERPAY: 'afterpay',
    AFTERPAYCASHAPP: 'afterpaycashapp',
    PAYPAL: 'paypal'
};

export const TERMS_AND_CONDITIONS_LINKS = {
    [PAYMENT_METHODS.KLARNA]: 'https://cdn.klarna.com/1.0/shared/content/legal/terms/0/en_us/sliceitinx',
    [PAYMENT_METHODS.AFTERPAY]: 'https://www.afterpay.com/en-US/installment-agreement',
    [PAYMENT_METHODS.PAYPAL]: 'https://www.paypal.com/us/webapps/mpp/campaigns/newmexicodisclosure'
};
