export default function getResource(label) {
    const resources = {
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
        reviewAndPlaceOrder: 'Review & Place Order'
    };

    return resources[label];
}
