export default function getResource(label, vars = []) {
    const resources = {
        pointsActivity: 'Activité liée aux points',
        viewAll: 'Tout afficher',
        noPoints: 'Votre activité liée aux points s’affichera ici.',
        doNotSeePoints: 'Vous ne voyez pas encore vos points? Votre activité sera mise à jour dans les 24 heures.',
        pointsText: 'Points',
        recentRecordsText: `Seules vos actions ${vars[0]} les plus récentes sont affichées.`,
        spendText: 'Dépensez',
        spendLabel: 'Dépensez',
        earnedLabel: 'Points accumulés',
        spendTotal: 'Total',
        earnedTotal: 'Total des points'
    };

    return resources[label];
}
