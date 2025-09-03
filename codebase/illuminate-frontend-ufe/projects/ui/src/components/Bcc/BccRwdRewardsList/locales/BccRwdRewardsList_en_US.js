export default function getResource(label, vars = []) {
    return {
        beautyInsiderRewards: 'Beauty Insider Rewards',
        add: 'Add',
        viewAll: 'View All',
        signInToAccess: 'Sign In to Access',
        notSignedIn: 'Sign in to redeem your points.',
        notEnoughPoints: 'You have',
        keepEarning: 'Keep earning to redeem rewards!',
        redeemPoints: 'Redeem your',
        points: 'points',
        rougeBadge: 'ROUGE'
    }[label];
}
