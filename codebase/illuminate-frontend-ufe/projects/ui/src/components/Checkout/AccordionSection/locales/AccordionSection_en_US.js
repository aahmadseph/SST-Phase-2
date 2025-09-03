export default function getResource(label) {
    const resources = {
        secure: 'Secure',
        edit: 'Edit',
        shippingTo: 'Shipping to',
        pickUpOrderContactInfo: 'Pickup Person',
        pickUpOrderLocationInfo: 'Pickup Location',
        giftCardShippingAddress: 'Gift Card Shipping Address',
        giftCardDeliveryMessage: 'Gift Card Delivery',
        shippingAddress: 'Shipping Address',
        deliveryGiftOptions: 'Shipping',
        deliveryAutoReplenish: 'Delivery',
        paymentMethod: 'Payment Method',
        accountCreation: 'Account Creation',
        reviewPlaceOrder: 'Review & Place Order',
        shippingDelivery: 'Shipping & Delivery',
        shippingToFedex: 'Shipping to FedEx Pickup Location',
        shipToPickupLocation: 'Ship to a Pickup Location',
        reviewSubmitEditsTitle: 'Review & Submit Edits',
        reviewSubmitSubscribeTitle: 'Review & Subscribe',
        updatedBadge: 'UPDATED',
        deliverTo: 'Deliver To',
        deliverToNote: 'Address used for both same-day & standard delivery orders',
        deliverToNoteAutoReplenish: 'Address used for auto-replenish, same-day, standard delivery orders',
        somePaymentCannotUsed: 'Some Payment Methods cannot be used when purchasing a subscription.',
        giftMessage: 'Gift Message',
        freeReturns: 'Free returns',
        onAllPurchases: 'on all purchases*'
    };

    return resources[label];
}
