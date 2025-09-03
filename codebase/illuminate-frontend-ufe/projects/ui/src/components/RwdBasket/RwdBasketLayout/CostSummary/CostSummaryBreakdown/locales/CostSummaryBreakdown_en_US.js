export default function getResource(label, vars = []) {
    const resources = {
        merchandiseSubtotalText: 'Subtotal',
        pointsUsed: 'Points Used (in this order)',
        discountsText: 'Discounts',
        free: 'FREE',
        tbdText: 'TBD',
        shippingAndHandlingText: 'Shipping',
        autoReplenishSavings: 'Auto-Replenish Savings',
        gstHstText: 'Estimated GST/HST',
        taxText: 'Estimated Tax',
        pickup: 'Pickup',
        bagFee: 'Pickup Bag Fee'
    };

    return resources[label];
}
