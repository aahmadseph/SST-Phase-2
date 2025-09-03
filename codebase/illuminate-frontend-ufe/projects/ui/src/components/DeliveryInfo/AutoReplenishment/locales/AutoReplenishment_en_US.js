export default function getResource(label, vars = []) {
    const resources = {
        autoReplenish: 'Auto-Replenish',
        freeShipping: 'Free Shipping with Auto-Replenish',
        getItFor: 'get it for',
        withAutoReplen: 'with Auto-Replenish',
        deliveryFrequency: 'Delivery Frequency',
        save: 'save',
        annuallySubscription: 'in your first year with this subscription.',
        subscriptionFreeShipping: 'Subscription Savings with Free Shipping',
        freeStandardShipping: 'Free Standard Shipping with Auto-Replenish'
    };
    return resources[label];
}
