
export default function getResource(label, vars = []) {
    const resources = {
        availableForOne: 'This item is not available for other fulfillment options.',
        availableForSomeButNotAll: 'This item is only available for some fulfillment options. Please check the product page to view your options.',
        chooseMethod: 'Choose Method',
        changeMethod: 'Change Method',
        cancel: 'Cancel',
        confirm: 'Confirm',
        sameDayDelivery: 'Same-Day Delivery',
        sameDayNotAvailable: 'Not available',
        selectForStoreAvailability: 'Select to see availability',
        for: 'for',
        to: 'to',
        yourLocation: 'your location',
        changeLocation: 'Change location',
        getItShipped: 'Get It Shipped',
        buyOnlineAndPickup: 'Buy Online and Pick Up',
        checkAvailability: 'Check availability',
        at: 'at',
        storesNearYou: 'stores near you',
        checkOtherStores: 'Check other stores',
        autoReplenish: 'Auto-Replenish',
        enrollFromPDP: 'Please enroll from the product page.',
        inStock: 'In Stock',
        limitedStock: 'Limited Stock',
        outOfStock: 'Out of Stock',
        getItSooner: 'Get It Sooner',
        withSddOrBopis: 'with Same-Day Delivery or Buy Online and Pickup',
        autoReplenishSwitchMessageNotice: 'If you switch to another fulfillment method and you would like Auto-Replenish again please enroll from the product details page.'
    };

    return resources[label];
}
