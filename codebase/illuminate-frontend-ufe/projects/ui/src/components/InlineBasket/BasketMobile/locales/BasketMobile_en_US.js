export default function getResource(label, vars = []) {
    const resources = {
        close: 'Close',
        sddItemAddedModalTitle: 'Added for Same-Day Delivery',
        bopisItemAddedModalTitle: 'Added for Pickup',
        shippingItemAddedModalTitle: 'Added for Get It Shipped',
        viewBasketAndReserve: 'View Basket & Reserve',
        viewBasketAndCheckout: 'View Basket & Checkout',
        ropisItemAdded: 'Item has been added to basket',
        pickUpAt: 'for pickup at ',
        sameDayDeliveryConfirmation: `Item has been added to basket for ${vars[0]} to `,
        item: 'Item',
        items: 'Items',
        qty: 'QTY',
        autoReplenishModalTitle: 'Added for Auto-Replenish',
        autoReplenishSuccessMessage: 'Item has been added and will be delivered every',
        autoReplenish: 'Auto-Replenish',
        sameDayDelivery: 'Same-Day Delivery',
        standard: 'Standard',
        seeAll: 'See all',
        getBackToYourBasket: 'Get Back to Your Basket',
        viewBasket: 'View Basket',
        viewBasketCheckout: 'View Basket & Checkout',
        inStock: 'In Stock',
        limitedStock: 'Limited Stock',
        checkout: 'Checkout'
    };

    return resources[label];
}
