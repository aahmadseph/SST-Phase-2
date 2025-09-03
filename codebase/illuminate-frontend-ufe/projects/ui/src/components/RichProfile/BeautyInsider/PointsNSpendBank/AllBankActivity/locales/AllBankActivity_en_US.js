export default function getResource(label, vars = []) {
    const resources = {
        title: 'Points Activity',
        backLink: 'Back to Beauty Insider',
        pointsText: 'Points',
        viewMoreTransactionsText: 'View more transactions',
        recentRecordsText: `Only your most recent ${vars[0]} records are available to display.`,
        spendText: 'Spend',
        spendLabel: 'Spend',
        earnedLabel: 'Earned Points',
        spendTotal: 'Total',
        earnedTotal: 'Total Points'
    };

    return resources[label];
}
