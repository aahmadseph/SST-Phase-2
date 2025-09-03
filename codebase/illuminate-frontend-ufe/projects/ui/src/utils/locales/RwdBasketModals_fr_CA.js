export default function getResource(label, vars = []) {
    const resources = {
        emptyBasket: 'Vider le panier',
        itemMoved: 'Article déplacé',
        emptyPickupBasket: 'Votre panier Achetez en ligne et ramassez est vide. Vous serez dirigé vers votre panier d’articles à livrer.',
        emptyDcBasket: 'Votre panier d’articles à livrer est vide. Vous serez dirigé vers votre panier Achetez en ligne et ramassez.',
        gotIt: 'Compris'
    };

    return resources[label];
}
