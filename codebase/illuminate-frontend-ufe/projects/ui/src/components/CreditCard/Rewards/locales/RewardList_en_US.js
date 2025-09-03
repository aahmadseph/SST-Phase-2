export default function getResource(label) {
    const resources = {
        paymentMethodErrorMessage: 'Your payment method must be set to your Sephora Card to apply Credit Card Rewards.',
        gotIt: 'Got it',
        showMore: 'Show more',
        showLess: 'Show less',
        applyRewards: 'Apply Credit Card Rewards*',
        available: 'available',
        applied: 'applied',
        orderSubtotal: 'Order Subtotal'
    };

    return resources[label];
}
