export default function getResource(label, vars = []) {
    const resources = {
        sameDayDelivery: 'Livraison le jour même',
        deliveringTo: 'Livrer à ',
        yourLocation: 'votre emplacement',
        notAvailable: 'La livraison le jour même n’est pas disponible pour '
    };
    return resources[label];
}
