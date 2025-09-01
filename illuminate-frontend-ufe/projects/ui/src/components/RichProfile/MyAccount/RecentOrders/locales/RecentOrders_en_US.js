export default function getResource(label, vars = []) {
    const resources = {
        orders: 'Orders',
        noOrders: 'You have no recent orders.',
        orderDate: 'Order Date',
        pickupOrder: 'Pickup Order',
        sameDayOrder: 'Same-Day Delivery',
        standardOrder: 'Standard Order',
        orderNumber: 'Order Number',
        orderType: 'Order Type',
        status: 'Status',
        details: 'Details',
        viewDetails: 'View Details',
        showMore: 'Show more',
        viewAllPurchases: 'View all purchases',
        replenItemsCarouselTitle: 'Restock Past Purchases',
        replenItemsViewAll: 'View All'
    };

    return resources[label];
}
