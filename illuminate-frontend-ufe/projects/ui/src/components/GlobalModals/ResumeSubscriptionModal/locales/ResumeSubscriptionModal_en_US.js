export default function getResource(label, vars = []) {
    const resources = {
        resumeSubscription: 'Resume Subscription',
        qty: 'Qty',
        deliveryEvery: 'Delivery Every',
        shippingAddress: 'Shipping Address',
        paymentMethod: 'Payment Method',
        nextShipment: 'Next Shipment by',
        item: 'ITEM',
        resume: 'Resume',
        cancel: 'Cancel',
        editMessage: 'You can make edits to your subscription after you’ve resumed shipments.',
        paymentMessage: 'By enrolling your card will be charged using your default payment method on file.',
        notRated: 'Not rated',
        oneReview: '1 review',
        yearlySavings: 'yearly savings',
        firstYearSavings: 'savings in your first year',
        lastDeliveryLeft: `delivery left at ${vars[0]}% off`,
        deliveriesLeft: `deliveries left at ${vars[0]}% off`,
        discountValidUntil: `Discount valid until ${vars[0]}`,
        discountsValidUntil: `Discounts valid until ${vars[0]}`
    };

    return resources[label];
}
