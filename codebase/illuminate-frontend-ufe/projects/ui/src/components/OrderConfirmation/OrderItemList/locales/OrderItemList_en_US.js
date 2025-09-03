export default function getResource(label, vars = []) {
    const resources = {
        item: 'Item',
        price: 'Price',
        qty: 'Qty',
        amount: 'Amount',
        oosItems: 'Out of Stock Items',
        readyForPickup: 'Items Ready for Pickup',
        pickedUpItems: 'Picked Up Items',
        canceledItems: 'Unavailable or Canceled Items',
        unavailableItems: 'Unavailable Items',
        deliveredItems: 'Delivered Items',
        notDeliveredItems: 'Items Getting Delivered'
    };

    return resources[label];
}
