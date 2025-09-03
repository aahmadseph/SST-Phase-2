export default function getResource(label, vars = []) {
    const resources = {
        mainTitle: 'Replacement Order',
        shippingAddressTitle: 'Shipping Address',
        deliveryTitle: 'Delivery',
        itemsTitle: 'Items',
        orderSubtotalPlusTax: 'Order Subtotal + Estimated Tax',
        oneTimeReplacement: 'One-Time Replacement',
        shippingAndHandling: 'Shipping & Handling',
        orderTotal: 'Order Total',
        itemSingular: 'item',
        itemPlural: 'items',
        terms: 'I have reviewed and verified my shipping address. I understand that I cannot make any modifications to my shipping address once I place my replacement order and that I cannot request another replacement for this order.',
        submitForReview: 'Submit for Review',
        selectSamplesText: 'Select up to 2 free samples',
        sessionExpired: 'Session expired',
        sessionExpiredMessage: 'Oops! Your session timed out so you will be redirected back to Order Details.',
        ok: 'Ok'

    };

    return resources[label];
}
