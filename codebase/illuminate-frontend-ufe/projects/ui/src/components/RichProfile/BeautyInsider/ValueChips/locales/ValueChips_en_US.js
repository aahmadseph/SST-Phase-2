export default function getResource(label, vars = []) {
    const resources = {
        title: 'Get More Out of Your Membership',
        tapBelowToExplore: 'Tap below to explore what we have in store',
        clickBelowToExplore: 'Click below to explore what we have in store',
        achievementUnlocked: 'Achievement unlocked!',
        superFan: 'You’re a Sephora superfan',
        tapBelowToSee: 'Tap below to see more ways to beauty with us.',
        clickBelowToSee: 'Click below to see more ways to beauty with us.',
        community: 'Community',
        takingAdvantageOfPerk: 'You’re taking advantage of this perk.',
        exploreNow: 'Explore Now',
        getInspo: 'Get inspo, advice, and recommendations from your people.',
        joinCommunity: 'Join Community',
        seeMonth: 'See this month',
        openApp: 'Open Sephora App',
        shopOnTheGo: 'Shop on the go, get early access to new releases, and more.',
        ccMember: 'You’re a Sephora Credit Card member! Keep shopping to earn 4% back in Sephora Credit Card Rewards.',
        getCC: `Get ${vars[0]}% off your first purchase when you open and use your Sephora Credit Card.`,
        seeRewards: 'See Your Rewards',
        applyNow: 'Apply Now',
        app: 'App',
        sephoraCC: 'SEPHORA Credit Card',
        youAreOnIt: 'You’re on it!'
    };

    return resources[label];
}
