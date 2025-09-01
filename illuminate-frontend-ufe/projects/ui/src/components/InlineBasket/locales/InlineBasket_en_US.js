export default function getResource(label, vars = []) {
    const resources = {
        goToBasket: 'Go To Basket',
        item: 'item',
        items: 'items'
    };
    return resources[label];
}
