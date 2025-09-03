export default function getResource(label, vars = []) {
    const resources = {
        saveMyPointsText: `Yes, save my ${vars[0]} Beauty Insider points from this purchase.`,
        emailRegisteredText: `${vars[0]} is already registered with Sephora. Sign in after placing your order to save your points.`,
        joinOurFreeProgramText: 'After placing your order, join our free loyalty program to redeem experiences, personalized services, and sample rewards.'
    };
    return resources[label];
}
