export default function getResource(label, vars = []) {
    const resources = {
        advertisingCookieBannerControlText: `Nous utilisons des témoins pour vous présenter des offres pertinentes et personnaliser votre expérience sur notre site. En cliquant sur « Accepter », vous nous permettez également de partager des renseignements avec nos partenaires de publicité et d’analyse. Voir ${vars[0]}.`,
        privacyPolicy: 'Politique de confidentialité',
        advertisingCookieBannerButtonText: 'Accepter',
        advertisingCookieBannerVariantText: `Nous accordons beaucoup d'importance à la protection de vos renseignements personnels et nous ne vendons pas vos données. En cliquant sur « Accepter », vous nous permettez toutefois de partager les renseignements que nous recueillons à votre sujet dans nos magasins et en ligne avec des partenaires tiers en matière de publicité et d'analyse. Voir ${vars[0]}.`
    };
    return resources[label];
}
