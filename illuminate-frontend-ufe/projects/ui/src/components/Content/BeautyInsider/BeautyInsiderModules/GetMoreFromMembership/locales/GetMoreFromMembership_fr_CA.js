export default function getResource(label, vars = []) {
    const resources = {
        community: 'Collectivité',
        communityContent: 'Trouvez des inspirations, des conseils et des recommandations parmi les membres.',
        communityButton1: 'Rejoignez la communauté',
        communityButton2: 'Découvrir',
        app: 'Appli Sephora',
        appContent: 'Magasinez à tout moment, bénéficiez de l’accès anticipé aux nouveautés, et plus encore.',
        creditCard: 'Carte de crédit Sephora',
        creditCardContent: 'Get 25% off your first purchase when you open and use your Sephora Credit Card.',
        creditButton1: 'S’inscrire',
        creditButton2: 'Gérer la carte',
        getMoreFromMembership: 'Profitez au maximum de votre adhésion',
        usingContent: 'Vous y êtes! Vous profitez de cet avantage.'
    };
    return resources[label];
}
