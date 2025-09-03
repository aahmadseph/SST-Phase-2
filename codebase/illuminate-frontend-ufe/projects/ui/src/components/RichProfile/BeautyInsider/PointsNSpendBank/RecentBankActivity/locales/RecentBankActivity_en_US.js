export default function getResource(label, vars = []) {
    const resources = {
        recentActivityText: 'Recent Activity',
        viewAllActivityLink: 'View all activity',
        spendLabel: 'Spend',
        earnedLabel: 'Earned',
        spendText: 'Spend'
    };

    return resources[label];
}
