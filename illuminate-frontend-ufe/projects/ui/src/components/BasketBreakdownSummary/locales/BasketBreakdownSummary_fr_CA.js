export default function getResource(label) {
    const resources = {
        sameDayDelivery: 'Livraison le jour même ',
        sameDayUnlimited: 'Livraison le jour même illimitée ',
        standard: 'Standard ',
        item: 'Article',
        items: 'Articles'
    };

    return resources[label];
}
