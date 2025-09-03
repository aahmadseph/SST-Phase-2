export default function getResource(label, vars = []) {
    const resources = {
        emptyBasket: 'Empty Basket',
        itemMoved: 'Item Moved',
        emptyPickupBasket: 'Your Buy Online and Pick Up basket is empty. You will be taken to your Get It Shipped basket.',
        emptyDcBasket: 'Your Get It Shipped basket is empty. You will be taken to your Buy Online and Pick Up basket.',
        gotIt: 'Got It'
    };

    return resources[label];
}
