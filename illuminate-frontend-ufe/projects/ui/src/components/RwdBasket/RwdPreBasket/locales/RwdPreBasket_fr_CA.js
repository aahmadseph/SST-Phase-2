export default function getResource(label, vars = []) {
    const resources = {
        mainTitle: 'Vos paniers',
        bopisTitle: `Achetez en ligne et ramassez en magasin (${vars[0]})`,
        bopisPromo: 'Les promotions et les récompenses admissibles peuvent être ajoutées à la page suivante.',
        bopisSubtotal: 'Sous-total des articles à ramasser',
        shippingTitle: `Expédition et livraison (${vars[0]})`,
        shippingPromo: 'Les promotions, les récompenses et les échantillons peuvent être ajoutés à la page suivante.',
        shippingSubtotal: 'Sous-total des articles expédiés',
        linkText: 'Voir le panier',
        linkMessage: 'Il n’y a aucun article dans votre panier d’expédition.',
        sameDayDelivery: 'Livraison le jour même'

    };
    return resources[label];
}
