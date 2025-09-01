export default function getResource(label, vars = []) {
    const resources = {
        product: 'product',
        products: 'products',
        of: 'of',
        showMoreProducts: 'Show More Products',
        noResults1: 'Sorry, there are no products that match your filter choices.',
        noResults2: 'Try changing some of your filters to see product results.',
        item: 'item',
        items: 'items'
    };

    return resources[label];
}
