export default function getResource(label, vars = []) {
    const resources = {
        free: 'Free',
        getItShipped: 'Get It Shipped',
        items: 'Items',
        title: 'Shipping Method',
        shipping: 'Shipping',
        autoReplenish: 'Auto-Replenish',
        deliveryFrequency: 'Delivery Frequency',
        chooseThisShippingSpeed: 'Choose This Shipping Speed',
        shippingMethodType: 'Standard',
        expeditedText: 'Expedited shipping options only available for the first delivery. Subsequent Auto-Replenish items will arrive via standard shipping.',
        changeShippingMethod: 'Change Shipping Method',
        waived: 'Waived',
        waiveShippingHandling: 'Waive Shipping & Handling'
    };

    return resources[label];
}
