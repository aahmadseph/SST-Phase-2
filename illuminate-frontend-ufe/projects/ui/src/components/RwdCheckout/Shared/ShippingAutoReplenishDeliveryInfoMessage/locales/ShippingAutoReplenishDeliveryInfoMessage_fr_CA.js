export default function getResource(label, vars = []) {
    const resources = {
        shippingAutoReplenishMessage: 'Les options d’expédition express ne s’appliquent qu’à la première livraison. Les articles à réapprovisionnement automatique subséquents arriveront par expédition standard.',
        gotIt: 'Compris'
    };

    return resources[label];
}
