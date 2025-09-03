export default function getResource(label, vars = []) {
    const resources = {
        biSummaryText: 'Beauty Insider Points Activity',
        pointsEarned: 'Points Earned',
        pointsUsed: 'Points Used',
        balanceUpdateMessage: 'Your points balance will be updated within 24 hours.'
    };

    return resources[label];
}
