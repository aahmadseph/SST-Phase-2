export default function getResource(label, vars = []) {
    const resources = {
        title: 'Sephora Same Day Unlimited',
        subscribeToSephora: 'Subscribe to Sephora’s',
        subHeader: 'Same-Day Unlimited',
        free30DayTrial: 'FREE 30-day trial',
        then: 'then',
        annually: 'annually',
        regionalAvailability: 'Regional Availability',
        addTrialToBasket: 'Add Free Trial to Basket',
        addSubscriptionToBasket: 'Add Subscription to Basket',
        sameDayUnlimited: 'Same Day Unlimited',
        add: 'Add',
        toBasket: 'to Basket',
        trial: 'Trial',
        subscription: 'Subscription',
        alreadyAddedToBasket: 'Already Added to Basket',
        viewBasket: 'View Basket & Checkout',
        joinForOnly: 'Join for only',
        hasBeenAdded: 'has been added to your basket!',
        activateSubscription: 'Activate your subscription and save on your current order by checking out.',
        activateYour: 'Activate your',
        free30day: 'FREE 30-day trial',
        andSave: 'and save on your current order by checking out.'
    };

    return resources[label];
}
