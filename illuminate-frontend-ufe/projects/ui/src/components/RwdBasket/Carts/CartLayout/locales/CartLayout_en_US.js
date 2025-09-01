export default function getResource(label, vars = []) {
    const resources = {
        qty: 'Quantity',
        loved: 'Loved',
        moveToLoves: 'Move to Loves',
        getItSooner: 'Get It Sooner',
        outOfStock: 'Out of Stock',
        outOfStockAtSelectedStore: 'Out of Stock at Selected Store',
        finalSale: '*Final Sale*: No Returns or Exchanges',
        onlyFewLeft: 'Only a Few Left',
        shippingRestrictions: 'Shipping Restrictions',
        shippingRestrictionModalText: 'Due to shipping regulations, this item and the rest of your order must ship ground (2-8 days total delivery time). This includes expedited orders.',
        gotIt: 'Got It',
        size: `SIZE ${vars[0]}`,
        item: `ITEM ${vars[0]}`,
        save: 'Save'
    };
    return resources[label];
}
