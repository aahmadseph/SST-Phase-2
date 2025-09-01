export default function getResource(label, vars = []) {
    const resources = {
        status: 'Status',
        seeTrackingDetails: 'See tracking details',
        shippingMethod: 'Shipping Method',
        estimatedDelivery: 'Estimated Delivery',
        tracking: 'Tracking #',
        deliverTo: 'Deliver To',
        billingInfo: 'Billing Info',
        paypalAccount: 'PayPal Account',
        applePay: 'Apple Pay',
        shipment: 'SHIPMENT',
        needToReturnSomething: 'Need To Return Something?',
        changedYourMind: 'Changed your mind?',
        cancelYourOrder: 'Cancel your order',
        paidWith: 'Paid with ',
        venmoAccount: 'Paid with Venmo',
        shipTo: 'Ship To',
        shipToFeDexLocation: 'Shipping to FedEx Pickup Location',
        shipToPickupLocation: 'Shipping to a pickup Location',
        deliveryBy: 'Delivery By',
        autoReplenish: 'Auto-Replenish',
        manageSubscriptions: 'Manage Subscriptions',
        deliveryIssue: 'Experiencing a Delivery Issue?',
        reportIssue: 'Report issue',
        bannerButton: 'Sign up for Sephora Texts',
        bannerTitle: 'Sign up for Sephora Texts',
        bannerParagraph: 'Stay in the loop on exclusive deals, product drops, and more.',
        bannerRates: '*Msg & data rates may apply.',
        returnText: 'You can start a return as soon as your Get It Shipped items are on their way.'
    };

    return resources[label];
}
