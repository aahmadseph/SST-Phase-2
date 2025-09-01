export default function getResource(label, vars = []) {
    const resources = {
        pointsActivity: 'Points Activity',
        viewAll: 'View all',
        noPoints: 'Your points activity will appear here.',
        doNotSeePoints: 'Don’t see your points yet? Your activity will update within 24 hours.',
        pointsText: 'Points',
        recentRecordsText: `Only your most recent ${vars[0]} records are available to display.`,
        spendText: 'Spend',
        spendLabel: 'Spend',
        earnedLabel: 'Earned Points',
        spendTotal: 'Total',
        earnedTotal: 'Total Points'
    };

    return resources[label];
}
