export default function getResource(label, vars = []) {
    const resources = {
        bopisTitle: 'Buy Online and Pick Up Checkout',
        sadTitle: 'Shipping and Delivery Checkout',
        subscriptionUpdate: 'Subscription Update',
        checkout: 'Checkout',
        pickupOrderCheckout: 'Pickup Order Checkout',
        additionalItemsText: 'Additional items in your shopping basket have been saved to purchase separately.',
        yourGiftCardShippedToAddressMessage: 'Your gift card will be shipped to this address.',
        shippedToAddressMessage: 'The remainder of your order will be shipped to this address.',
        saveContinueButton: 'Save & Continue',
        free: 'FREE',
        continueToCheckout: 'Continue to Checkout',
        addTheseModalTitle: 'Add These for Under $10',
        reviewAndPlaceOrder: 'Review & Place Order',
        cartServiceError: `Unable to place your order. Trouble connecting to ${vars[0]}. Please use a different payment method or try again later.<br><br>If applicable, we have reversed any pending charges to your account.`,
        error: 'Error',
        ok: 'OK',
        authorizeErrorMessage: `Trouble connecting to ${vars[0]}. Please use a different payment method or try again later.`
    };

    return resources[label];

}
