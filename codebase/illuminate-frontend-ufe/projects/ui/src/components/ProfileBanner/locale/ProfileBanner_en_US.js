export default function getResource(label, vars = []) {
    const resources = {
        beautyInsiderTitle: 'Beauty Insider',
        beautyInsiderDescription: 'Your loyalty activity, savings, benefits, and more.',
        rewardsBazaarTitle: 'Rewards Bazaar',
        rewardsBazaarDescription: 'Use your points to redeem samples and more.',
        joinNowBtn: 'Join Now',
        signInBtn: 'Sign In',
        rewardText: 'Ready to get rewarded?',
        beautyText: 'Already a Beauty Insider?',
        insiderText: 'You\'re an',
        vibText: 'You\'re a',
        pointsText: 'Your points',
        with: 'with ',
        points: ' points.',
        barcodeTitle: 'Your Beauty Insider Card',
        barcodeDesc: 'Scan this barcode at checkout in the store to earn points and redeem rewards.',
        showCard: 'Show Beauty Insider Card'
    };
    return resources[label];
}
