export default function getResource(label, vars = []) {
    const resources = {
        item: 'ITEM',
        outOfStock: 'Out of Stock',
        outOfStockAtStore: 'Out of Stock at Selected Store',
        soldOut: 'sold out',
        remove: 'Remove',
        moveToLoves: 'Move to Loves'
    };

    return resources[label];
}
