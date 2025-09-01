export default function getResource(label, vars = []) {
    const resources = {
        item: 'ITEM',
        items: 'items',
        qty: 'QTY',
        basketSubtotal: 'Basket Subtotal',
        subTotal: 'Subtotal',
        continue: 'Continue Shopping',
        seeSamples: 'See samples, rewards and promotions in',
        basket: 'basket',
        standardTitle: 'Added for Get It Shipped',
        sddTitle: 'Added for Same-Day Delivery',
        reserveTitle: `Added for Pickup at ${vars[0]}`,
        autoReplenishTitle: 'Added for Auto-Replenish',
        proceedToBasket: 'Proceed to Basket',
        viewInBasket: 'View in Basket',
        viewAndCheckout: 'View Basket & Checkout',
        viewAndReserve: 'View Basket & Reserve',
        testSeeDetails: 'See details',
        mostCommon: 'most common',
        deliverEvery: 'Deliver every',
        weeksShort: 'wks.',
        monthsShort: 'mo.',
        months: 'months',
        weeks: 'weeks',
        urgencyMessage: 'ONLY A FEW LEFT - CHECK OUT SOON',
        viewBasket: 'View Basket',
        limitedStock: 'Limited Stock',
        inStock: 'In Stock',
        at: 'at',
        for: 'for',
        checkout: 'Checkout'
    };

    return resources[label];
}
