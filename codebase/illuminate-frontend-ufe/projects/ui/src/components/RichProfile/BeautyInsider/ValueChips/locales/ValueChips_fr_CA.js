export default function getResource(label, vars = []) {
    const resources = {
        title: 'Profitez au maximum de votre adhésion',
        tapBelowToExplore: 'Cliquez ci-dessous pour explorer nos articles en magasin',
        clickBelowToExplore: 'Cliquez ci-dessous pour explorer le magasin',
        achievementUnlocked: 'Niveau débloqué!',
        superFan: 'Vous êtes accro à Sephora',
        tapBelowToSee: 'Touchez ci-dessous pour découvrir d’autres façons de mettre votre beauté en valeur avec nous.',
        clickBelowToSee: 'Cliquez ci-dessous pour découvrir d’autres façons de mettre votre beauté en valeur avec nous.',
        community: 'Collectivité',
        takingAdvantageOfPerk: 'Vous profitez de cet avantage.',
        exploreNow: 'Découvrir',
        getInspo: 'Trouvez des inspirations, des conseils et des recommandations parmi les membres.',
        joinCommunity: 'Rejoignez la communauté',
        seeMonth: 'Consultez les',
        openApp: 'Ouvrez l’appli Sephora',
        shopOnTheGo: 'Magasinez à tout moment, bénéficiez de l’accès anticipé aux nouveautés, et plus encore.',
        ccMember: 'Vous êtes titulaire d’une carte de crédit Sephora! Keep shopping to earn 4% back in Sephora Credit Card Rewards.',
        getCC: `Get ${vars[0]}% off your first purchase when you open and use your Sephora Credit Card.`,
        seeRewards: 'Voir vos récompenses',
        applyNow: 'S’inscrire',
        app: 'Application',
        sephoraCC: 'SEPHORA Credit Card',
        youAreOnIt: 'Vous y êtes!'
    };

    return resources[label];
}
