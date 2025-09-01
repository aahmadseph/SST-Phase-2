export default function getResource(label) {
    const resources = {
        movedToYour: 'has been moved to your',
        gotIt: 'Got It',
        undo: 'Undo',
        Pickup: 'Buy Online and Pick Up order.',
        Sameday: 'Same-Day Delivery order.',
        Standard: 'Get It Shipped order.',
        subItemRemoved: 'Your substitute item has been removed.'
    };

    return resources[label];
}
