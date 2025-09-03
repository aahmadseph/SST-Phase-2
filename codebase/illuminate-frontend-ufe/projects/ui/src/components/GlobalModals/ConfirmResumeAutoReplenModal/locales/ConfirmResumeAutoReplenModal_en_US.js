export default function getResource(label, vars = []) {
    const resources = {
        title: 'Auto-Replenish Resumed',
        mainHeader: 'You’re all set',
        subHeader: 'Your Auto-Replenish has resumed and will start shipments on ',
        item: 'ITEM',
        qty: 'Qty',
        notRated: 'Not rated',
        oneReview: '1 review',
        yearlySavings: 'yearly savings',
        done: 'Done',
        firstYearSavings: 'savings in your first year',
        lastDeliveryLeft: `delivery left at ${vars[0]}% off`,
        deliveriesLeft: `deliveries left at ${vars[0]}% off`,
        discountValidUntil: `Discount valid until ${vars[0]}`,
        discountsValidUntil: `Discounts valid until ${vars[0]}`
    };

    return resources[label];
}
