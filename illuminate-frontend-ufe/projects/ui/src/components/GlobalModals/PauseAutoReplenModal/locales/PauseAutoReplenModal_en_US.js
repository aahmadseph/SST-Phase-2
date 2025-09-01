export default function getResource(label, vars = []) {
    const resources = {
        title: 'Pause Item',
        mainHeader: 'Are you sure you would like to pause your Auto-Replenish? You may resume at any time.',
        pause: 'Pause',
        cancel: 'Cancel',
        item: 'ITEM',
        qty: 'Qty',
        notRated: 'Not rated',
        oneReview: '1 review',
        yearlySavings: 'yearly savings',
        rememberMessage: `Remember, you only have until ${vars[0]} to claim your ${vars[1]} remaining ${vars[2]}% off`,
        last: 'last',
        discount: 'discount',
        discounts: 'discounts',
        firstYearSavings: 'savings in your first year',
        lastDeliveryLeft: `delivery left at ${vars[0]}% off`,
        deliveriesLeft: `deliveries left at ${vars[0]}% off`,
        discountValidUntil: `Discount valid until ${vars[0]}`,
        discountsValidUntil: `Discounts valid until ${vars[0]}`

    };

    return resources[label];
}
