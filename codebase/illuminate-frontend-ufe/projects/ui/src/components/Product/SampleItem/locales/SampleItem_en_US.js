export default function getResource(label, vars = []) {
    const resources = {
        addFullSize: 'Add Full Size',
        addToBasket: 'Add to Basket',
        add: 'Add',
        remove: 'Remove',
        viewLarger: 'View Larger',
        free: 'Free'
    };

    return resources[label];
}
