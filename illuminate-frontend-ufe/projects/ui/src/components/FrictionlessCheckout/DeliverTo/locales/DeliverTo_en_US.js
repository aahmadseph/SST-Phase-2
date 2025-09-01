const resources = {
    gisTitle: 'Deliver To',
    sDDAndGISOrders: 'For both Same-Day and Get It Shipped orders.',
    gISAndAROrders: 'For both Get It Shipped and Auto-Replenish orders.',
    sDDAndAROrders: 'For both Same-Day and Auto-Replenish orders.',
    sDDAndGISAndAROrders: 'For Same-Day, Get It Shipped and Auto-Replenish orders.',
    holdAtLocation: 'FedEx Location',
    holdAtLocationCA: 'Canada Post Pickup Point',
    deliveryAndPickupInformation: 'Delivery and Pickup Information'
};

export default function getResource(label) {
    return resources[label];
}
