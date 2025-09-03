export default function getResource(label, vars=[]) {
    const resources = {
        sddRougePromoBannerTitle: 'Vous voulez vos articles aujourd’hui? ',
        sddRougePromoBannerMessage: `Les membres Rouge peuvent profiter la livraison le jour même gratuite avec toute commande de ${vars[0]} $ ou plus! Vérifiez la disponibilité en appuyant sur le bouton « Obtenez-le plus tôt ».`,
        sddRougeMemberBannerMessage: 'Les membres Rouge peuvent aussi essayer gratuitement la livraison le jour même! Vérifiez la disponibilité en appuyant sur le bouton « Changer de méthode ».'
    };

    return resources[label];
}
