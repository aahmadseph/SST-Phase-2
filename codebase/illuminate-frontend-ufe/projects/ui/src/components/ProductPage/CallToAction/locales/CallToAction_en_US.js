export default function getResource(label, vars = []) {
    const resources = {
        userLabelText: `You must be ${vars[0]} to access this product.`,
        signIn: 'Sign in',
        or: 'or',
        signUp: 'Sign up',
        learnMore: 'Learn more',
        download: 'Download',
        openApp: 'open the Sephora app to purchase.',
        bopisTooltip: 'Scroll down and tap “Same-Day Delivery” or “Buy Online & Pick Up” to get your beauty today.',
        SDDRougeFreeShip: 'Scroll down and tap “Same-Day Delivery” to try this free benefit as a Rouge member.',
        SDDRougeTestFreeShipping: `Scroll down and tap “Same-Day Delivery” to try this free benefit on $${vars[0]}+ orders as a Rouge member.`
    };
    return resources[label];
}
