export default function getResource(label, vars = []) {
    const resources = {
        title: 'Skip Item',
        mainHeader: 'Are you sure you would like to skip your next order? Your subscription will automatically resume shipment on',
        skip: 'Skip',
        cancel: 'Cancel',
        item: 'ITEM',
        qty: 'Qty',
        notRated: 'Not rated',
        oneReview: '1 review',
        yearlySavings: 'yearly savings',
        nextShipmentBy: 'Next Shipment by',
        skipRememberMessage: 'Remember, you only have until',
        skipRememberMessageLastRemaining: `to claim your last remaining ${vars[0]}% off discount.`,
        skipRememberMessageNonLastRemaining: `to claim your ${vars[0]} remaining ${vars[1]}% off discounts.`,
        firstYearSavings: 'savings in your first year',
        lastDeliveryLeft: `delivery left at ${vars[0]}% off`,
        deliveriesLeft: `deliveries left at ${vars[0]}% off`,
        discountValidUntil: `Discount valid until ${vars[0]}`,
        discountsValidUntil: `Discounts valid until ${vars[0]}`,
        rateOf: 'at a rate of',
        percentageOff: `${vars[0]}% off`,
        disruptsScheduleMessage: `Get your item before ${vars[0]}, to claim your`,
        disruptsScheduleMessageNonLast: `${vars[0]} remaining ${vars[1]}% off discounts before they expire`,
        disruptsScheduleMessageLast: `last remaining ${vars[0]}% off discount before it expires`
    };

    return resources[label];
}
