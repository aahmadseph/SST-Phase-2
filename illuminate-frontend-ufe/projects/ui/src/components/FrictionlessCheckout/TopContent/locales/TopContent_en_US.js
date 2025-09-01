const resources = {
    freeReturns: 'Free returns on all purchases*',
    verifyCVVeFulfilledOrder: 'No shipping address or payment is required for this order. CVV/CVC is required for security purposes only. Please review your information before placing your order.',
    verifyCVV: 'No payment is required, verify your CVV/CVC number for security purposes. Please review your information before placing your order.',
    noPaymentRequired: 'No payment is required. Please review your information before placing your order.'
};

export default function getResource(label) {
    return resources[label];
}
