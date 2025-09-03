export default function getResource(label) {
    const resources = {
        curbsideAvailable: 'Côté trottoir offert',
        pickup: 'Ramassage',
        sameDayDelivery: 'Livraison le jour même'
    };
    return resources[label];
}
