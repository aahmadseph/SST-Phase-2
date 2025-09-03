export default function getResource(label) {
    const resources = {
        qty: 'Quantité',
        inBasket: 'dans le panier',
        standardShipping: 'Faites livrer',
        sdd: 'pour la livraison le jour même',
        bopis: 'pour le ramassage en magasin',
        basketUpdated: 'Panier mis à jour'
    };
    return resources[label];
}
