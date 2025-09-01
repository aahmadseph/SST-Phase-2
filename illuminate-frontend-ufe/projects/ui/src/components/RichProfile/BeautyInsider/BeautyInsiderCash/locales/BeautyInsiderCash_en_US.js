export default function getResource(label, vars = []) {
    const resources = {
        canApply: `You can now apply *${vars[0]} points* to your purchase for`,
        canApplyUpTo: `You can now apply up to *${vars[0]} points* for`,
        pointText: 'point',
        pointsText: 'points',
        missingPointsClose: `You are *${vars[0]} ${vars[1]}* away from *${vars[2]} off*.`,
        onceYouEarn: `Once you earn *${vars[0]} points*, you can apply them to your purchase for *${vars[1]} off*.`,
        cashWillApplyHere: 'Your Beauty Insider Cash will appear here.',
        applyInBasket: 'Apply in Basket',
        shopToEarnPoints: 'Shop to Earn Points',
        BICash: 'Beauty Insider Cash',
        BICashOptions: 'Beauty Insider Cash Options',
        off: 'off'
    };
    return resources[label];
}
