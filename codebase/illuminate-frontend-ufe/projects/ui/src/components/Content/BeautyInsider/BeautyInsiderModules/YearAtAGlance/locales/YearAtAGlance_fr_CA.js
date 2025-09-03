export default function getResource(label, vars = []) {
    const resources = {
        moreInformation: 'Plus d’information',
        ccRewards: 'Récompenses carte de crédit obtenues',
        yearEarnings: `Vos gains ${vars[0]} apparaîtront ici.`,
        keepShopping: 'Continuez à magasiner pour obtenir des récompenses, des privilèges et des réductions!',
        pointsEarned: 'Points gagnés',
        basePoints: 'Points de base',
        bonusPoints: 'Points en prime',
        dollarsSaved: 'Promotions et réductions appliquées',
        rougeRcDollar: 'Récompenses Rouge obtenues',
        cashApplied: 'Dollars Beauty Insider appliqués',
        shopNow: 'Magasiner',
        referralPtsEarned: 'Points de recommandation accumulés',
        points: 'points',
        yearGlance: `${vars[0]} en un coup d’œil`
    };

    return resources[label];
}
