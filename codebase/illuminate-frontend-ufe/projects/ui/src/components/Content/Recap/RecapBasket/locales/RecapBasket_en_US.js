export default function getResource(label, vars = []) {
    const resources = {
        basket: 'basket',
        checkout: 'Checkout',
        item: 'item',
        total: `You have ${vars[0]} in your ${vars[1]}.`,
        applyPoints: 'Apply *500 points* for *$10 off* at Checkout',
        freeShipping: 'FREE Standard Shipping'
    };

    return resources[label];
}
