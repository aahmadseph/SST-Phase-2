export default function getResource(label, vars = []) {
    const resources = {
        cardNumber: 'Card Number',
        cvc: 'CVV/CVC',
        firstName: 'First Name',
        lastName: 'Last Name',
        expiredMessage: 'Expired credit card.',
        endingIn: 'ending in',
        mm: 'MM',
        yy: 'YY'
    };

    return resources[label];
}
