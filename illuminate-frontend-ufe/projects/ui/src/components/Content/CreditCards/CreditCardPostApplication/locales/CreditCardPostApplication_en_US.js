const resources = {
    continueShopping: 'Continue Shopping',
    checkoutNow: 'Checkout Now',
    viewDetails: 'View details',
    whatYouNeedToKnow: 'What You Need to Know',
    creditLimit: 'Credit Limit: '
};

export default function getResource(label) {
    return resources[label];
}
