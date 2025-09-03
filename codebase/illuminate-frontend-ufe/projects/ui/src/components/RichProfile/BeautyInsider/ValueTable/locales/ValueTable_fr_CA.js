export default function getResource(label, vars = []) {
    const resources = {
        moreInformation: 'Plus d’information',
        creditCardRewards: 'Récompenses carte de crédit obtenues',
        yearEarnings: `Vos gains ${vars[0]} apparaîtront ici.`,
        keepShopping: 'Continuez à magasiner pour obtenir des récompenses, des privilèges et des réductions!',
        pointsEarned: 'Points gagnés',
        basePoints: 'Points de base',
        bonusPoints: 'Points en prime',
        promos: 'Promotions et réductions appliquées',
        rougeRewardsEarned: 'Récompenses Rouge obtenues',
        biCashApplied: 'Dollars Beauty Insider appliqués',
        shopNow: 'Magasiner',
        referralPointsEarned: 'Points de recommandation accumulés',
        points: 'points'
    };

    return resources[label];
}
