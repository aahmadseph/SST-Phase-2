export default function getResource(label, vars = []) {
    const resources = {
        paymentsAndCredits: 'Payments & Credits',
        creditCards: 'Credit / Debit Cards',
        otherPayments: 'Other Payments',
        giftCards: 'Gift Cards',
        accountCredits: 'Account Credits',
        expires: 'Expires'
    };

    return resources[label];
}
