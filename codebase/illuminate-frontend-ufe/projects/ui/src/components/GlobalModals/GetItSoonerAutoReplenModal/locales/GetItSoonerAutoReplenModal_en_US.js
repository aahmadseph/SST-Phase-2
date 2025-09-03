export default function getResource(label, vars = []) {
    const resources = {
        title: 'Get It Sooner',
        mainHeader: 'Skip your next shipment and add to basket below. Your subscription will automatically resume shipments on',
        cancel: 'Cancel',
        item: 'ITEM',
        qty: 'Qty',
        notRated: 'Not rated',
        oneReview: '1 review',
        yearlySavings: 'yearly savings',
        nextShipmentBy: 'Next Shipment by',
        addToBasket: 'Add to Basket'
    };

    return resources[label];
}
