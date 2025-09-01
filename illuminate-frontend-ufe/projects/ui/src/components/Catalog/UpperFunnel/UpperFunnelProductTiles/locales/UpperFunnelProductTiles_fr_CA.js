export default function getResource(label, vars = []) {
    const resources = {
        curbsideAvailable: 'Côté trottoir offert',
        pickup: 'Ramassage',
        sameDayDelivery: 'Livraison le jour même',
        shipToHomeTitle: 'Faites livrer',
        shipToHomeShipMessage: `Livraison d’ici le ${vars[0]} au ${vars[1]}`
    };
    return resources[label];
}
