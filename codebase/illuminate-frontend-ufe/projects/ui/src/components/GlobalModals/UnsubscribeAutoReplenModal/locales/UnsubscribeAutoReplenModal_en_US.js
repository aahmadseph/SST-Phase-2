export default function getResource(label, vars = []) {
    const resources = {
        title: 'Unsubscribe',
        unsubscribeSubHeader: 'Unsubscribe from your subscription?',
        youHaveSaved: 'you have saved',
        since: 'since',
        youWillSave: 'You will save',
        nextYear: 'in the next year with this subscription.',
        qty: 'Qty',
        yearlySavings: 'yearly savings',
        nevermindCTA: 'Nevermind',
        unsubscribeCTA: 'Unsubscribe',
        item: `ITEM ${vars[0]}`,
        skipNextDelivery: 'Skip Next Delivery Instead',
        cancellingWillForfeit: 'Canceling will forfeit your',
        last: 'last',
        limitedTime: 'limited-time',
        percentageOff: `${vars[0]}% off`,
        discount: 'discount',
        discounts: 'discounts',
        futureSubscriptions: `Future Auto-Replenish subscriptions for this product will receive a discount of ${vars[0]}%`,
        firstYearSavings: 'savings in your first year',
        lastDeliveryLeft: `delivery left at ${vars[0]}% off`,
        deliveriesLeft: `deliveries left at ${vars[0]}% off`,
        discountValidUntil: `Discount valid until ${vars[0]}`,
        discountsValidUntil: `Discounts valid until ${vars[0]}`
    };

    return resources[label];
}
