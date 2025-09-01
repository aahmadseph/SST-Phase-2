export default function getResource(label, vars = []) {
    const resources = {
        rewardRedemptionsText: 'Découvrez comment vos dépenses se transforment en points, consultez vos récompenses échangées, et plus encore.',
        noActivityText: 'Vous n’avez aucune activité Beauty Insider à afficher.',
        pointsExpiredText: 'Vos points sont expirés.',
        earnPointsText: 'Magasiner pour accumuler des points'
    };

    return resources[label];
}
