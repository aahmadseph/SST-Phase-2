export default function getResource(label, vars = []) {
    const resources = {
        ssdRougeTestV2InfoModalTitle: 'Livraison gratuite le jour même Rouge',
        ssdRougeTestV2InfoModalMsg1: `Pour profiter de cet avantage pour membre Rouge, vos articles livrés le jour même doivent totaliser ${vars[0]} $ ou plus avant taxes, une fois les réductions et les promotions appliqués.`,
        ssdRougeTestV2InfoModalMsg2: 'Vous voulez profiter de la livraison le jour même GRATUITE sur toute commande? Inscrivez-vous à la',
        ssdRougeTestV2InfoModalMsgLink: 'Livraison le jour même illimitée',
        ssdRougeTestV2InfoModalMsg3: 'aujourd’hui.',
        ssdRougeTestV2InfoModalMsgButton: 'Compris'
    };

    return resources[label];
}
