export default function getResource(label, vars = []) {
    const resources = {
        defaultCard: 'Default Card',
        expires: 'Expires',
        payPalAccount: 'PayPal Account',
        payWithPayPal: 'Pay with PayPal',
        payNow: 'Pay now',
        or: 'or',
        payLaterWithPayPal: 'Pay Later with PayPal',
        payWithApplePay: 'Pay with ApplePay',
        payWithKlarna: `Pay with 4 interest-free payments of ${vars[0]}`,
        payWithAfterpay: `Pay with 4 interest-free payments of ${vars[0]}`,
        payWithPaze: 'Pay with Paze',
        payWithVenmo: 'Pay with Venmo',
        storeCreditApplied: 'Account Credit Applied',
        endingIn: 'ending in',
        paymentDisabled: `${vars[0]} cannot be used for Gift Cards, Subscription, or In-store Appointment purchases; with Sephora Credit Card Rewards; or on orders with a total of ${vars[1]} or more.`,
        pazePaymentDisabled: 'Paze cannot be used for Gift Cards, Subscription, or In-store Appointment purchases; with Sephora Credit Card Rewards.',
        payPalDisabled: 'PayPal cannot be used when purchasing a subscription.',
        paymentGiftCardMessage: `Gift cards are not combinable with ${vars[0]}. If you want to use a gift card, please select another payment method.`,
        payzeAvailabilty: 'Available for consumers of participating banks and credit unions',
        pazeErrorMessage: 'We’re sorry we cannot authorize your Paze payment. Please select a different payment method.',
        pazeErrorTitle: 'Error',
        pazeErrorOk: 'Ok',
        pazePolicy: 'By clicking Continue to Paze, I am instructing Sephora to send my order and billing information to Paze and understand that information will be subject to the Paze terms and the Paze privacy policy.'
    };

    return resources[label];
}
