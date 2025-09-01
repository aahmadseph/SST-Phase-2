export default function getResource(label, vars = []) {
    const resources = {
        autoReplenishTitle: `Réapprovisionnement automatique (${vars[0]})`,
        changeMethod: 'Changer la méthode',
        free: 'GRATUIT',
        sameDayDelivery: 'Livraison le jour même'
    };

    return resources[label];
}
