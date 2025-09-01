export default function getResource(label, vars = []) {
    const resources = {
        rewardRedemptionsText: 'See how what you spend translates into points, view your reward redemptions, and more.',
        noActivityText: 'You do not have any Beauty Insider activity to display.',
        pointsExpiredText: 'Your points have expired.',
        earnPointsText: 'Shop now to earn points'
    };

    return resources[label];
}
