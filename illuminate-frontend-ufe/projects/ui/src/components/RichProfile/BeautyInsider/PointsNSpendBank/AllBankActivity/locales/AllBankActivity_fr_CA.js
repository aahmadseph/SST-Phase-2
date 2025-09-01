export default function getResource(label, vars = []) {
    const resources = {
        title: 'Activité liée aux points',
        backLink: 'Retour à Beauty Insider',
        pointsText: 'Points',
        viewMoreTransactionsText: 'Voir plus de transactions',
        recentRecordsText: `Seules vos actions ${vars[0]} les plus récentes sont affichées.`,
        spendText: 'Dépensez',
        spendLabel: 'Dépensez',
        earnedLabel: 'Points accumulés',
        spendTotal: 'Total',
        earnedTotal: 'Total des points'
    };

    return resources[label];
}
