export default function getResource(label) {
    const resources = {
        subscribeToSephora: 'S’abonner à la',
        sameDayUnlimited: 'Livraison le jour même illimitée'
    };

    return resources[label];
}
