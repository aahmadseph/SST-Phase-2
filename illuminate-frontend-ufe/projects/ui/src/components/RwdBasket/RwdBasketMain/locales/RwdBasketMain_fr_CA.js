export default function getResource(label, vars=[]) {
    const resources = {
        bopisTitle: `Achetez en ligne et ramassez en magasin (${vars[0]})`,
        shippingTitle: `Panier d’expédition et de livraison (${vars[0]})`,
        basketSwitchBOPIS: 'Consultez votre panier d’articles « Achetez en ligne, ramassez en magasin »',
        basketSwitchShipping: 'Consultez votre panier d’expédition et de livraison',
        sddRougePromoBannerTitle: 'Vous voulez vos articles aujourd’hui? ',
        sddRougePromoBannerMessage: `Les membres Rouge peuvent profiter la livraison le jour même gratuite avec toute commande de ${vars[0]} $ ou plus! Vérifiez la disponibilité en appuyant sur le bouton « Obtenez-le plus tôt ».`
    };

    return resources[label];
}
