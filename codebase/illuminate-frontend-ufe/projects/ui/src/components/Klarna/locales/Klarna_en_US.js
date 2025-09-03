export default function getResource(label, vars = []) {
    const resources = {
        installmentsWithAfterpayAndKlarna: `or 4 payments of ${vars[0]} with`,
        boldInstallmentsWithAfterpayAndKlarna: `or *4 payments of ${vars[0]}* with`,
        or: 'or ',
        testCardDiscount: `or ${vars[0]} off your Sephora order when you open and use a Sephora Credit Card today.¹`,
        test: 'Earn 2x Beauty Insider Points with every $1 spent using your Sephora Credit Card at Sephora',
        testSeeDetails: 'See details',
        learnMore: 'Learn more',
        openBuyNowPayLater: `Open buy now pay later ${vars[0]} modal`
    };

    return resources[label];
}
