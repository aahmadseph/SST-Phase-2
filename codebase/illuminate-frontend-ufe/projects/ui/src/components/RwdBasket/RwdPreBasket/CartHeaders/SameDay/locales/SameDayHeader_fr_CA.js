export default function getResource(label, vars = []) {
    const resources = {
        sameDayDelivery: 'Livraison le jour même',
        deliveringTo: 'Livrer à ',
        yourLocation: 'votre emplacement'
    };
    return resources[label];
}
