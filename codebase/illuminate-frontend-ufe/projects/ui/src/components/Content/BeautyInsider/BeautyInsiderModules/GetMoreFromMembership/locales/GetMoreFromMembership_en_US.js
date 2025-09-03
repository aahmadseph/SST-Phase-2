export default function getResource(label, vars = []) {
    const resources = {
        community: 'Community',
        communityContent: 'Get inspo, advice, and recommendations from your people.',
        communityButton1: 'Join Community',
        communityButton2: 'Explore Now',
        app: 'Sephora App',
        appContent: 'Shop on the go, get early access to new releases, and more.',
        creditCard: 'Sephora Credit Card',
        creditCardContent: 'Get 25% off your first purchase when you open and use your Sephora Credit Card.',
        creditButton1: 'Apply Now',
        creditButton2: 'Manage Card',
        getMoreFromMembership: 'Get More Out of Your Membership',
        usingContent: 'You’re on it! You’re taking advantage of this perk.'
    };
    return resources[label];
}
