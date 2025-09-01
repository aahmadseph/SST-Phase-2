export default function getResource(label) {
    const resources = {
        signIn: 'Sign In',
        sigInToSeeItems: 'Sign in to see items you may have added previously.',
        seeSamplesRewardsPromotions: 'See samples, rewards, and promos in',
        basket: 'basket',
        dcTotal: 'Shipping and Delivery ',
        basketTotal: 'Subtotal ',
        reserveTotal: 'Reserve & Pick Up ',
        bopisTotal: 'Buy Online and Pick Up ',
        checkout: 'View Basket & Checkout',
        emptyBasket: 'Your basket is empty.',
        item: 'item',
        or: 'or',
        shopNewArrivals: 'Shop New Arrivals',
        viewAll: 'View all',
        freeShipping: 'Free Shipping',
        createAccount: 'Create Account',
        basketHeader: 'Shipping and Delivery',
        reserveHeader: 'Reserve & Pick Up',
        bopisHeader: 'Buy Online and Pick Up',
        sameDayDelivery: 'Same-Day Delivery',
        standardDelivery: 'Get It Shipped',
        autoreplenish: 'Auto-Replenish'
    };

    return resources[label];
}
