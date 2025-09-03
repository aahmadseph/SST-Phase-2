export default function getResource(label, vars = []) {
    const resources = {
        manageSubscription: 'Manage Subscription',
        qty: 'Qty',
        notRated: 'Not rated',
        oneReview: '1 review',
        deliveryEvery: 'Delivery Every',
        shippingAddress: 'Shipping Address',
        paymentMethod: 'Payment Method',
        deliveryFrequency: 'Delivery Frequency',
        item: `ITEM ${vars[0]}`,
        chooseDeliveryFreq: 'Choose Delivery Frequency:',
        every: 'Every',
        mostCommon: 'Most Common',
        youWillSave: 'you will save',
        annualyWithSubs: 'annually with this subscription.',
        save: 'Save',
        cancel: 'Cancel',
        frequencyNumber: 'Frequency Number',
        frequencyType: 'Frequency Type',
        skip: 'Skip',
        pause: 'Pause',
        autoReplenishSummary: 'Auto-Replenish Summary',
        active: 'Active',
        paused: 'Paused',
        viewShipments: 'View Shipments',
        biPointsEarned: 'Beauty Insider Points earned from Auto-Replenish',
        totalSaving: 'Total Auto-Replenish Savings',
        points: 'points',
        askToUpdateDelivery: 'Want it sooner? Update your delivery frequency.'
    };

    return resources[label];
}
