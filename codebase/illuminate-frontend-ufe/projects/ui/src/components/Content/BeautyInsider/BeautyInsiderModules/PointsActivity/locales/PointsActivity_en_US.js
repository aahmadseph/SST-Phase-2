export default function getResource(label, vars = []) {
    const resources = {
        orderNumber: 'Order Number',
        pointsRedeemed: 'Points Redeemed',
        pointsearned: 'Points Earned',
        totalPoints: 'Total Points to Date',
        spentToDate: 'Spent to Date',
        viewAll: 'View All',
        title: 'Points Activity',
        noPoints: 'Your points activity will appear here.',
        doNotSeePoints: 'Don’t see your points yet? Your activity will update within 24 hours.'
    };
    return resources[label];
}
