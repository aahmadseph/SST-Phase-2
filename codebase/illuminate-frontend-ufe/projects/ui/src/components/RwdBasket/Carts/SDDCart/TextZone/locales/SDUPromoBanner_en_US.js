export default function getResource(label, vars = []) {
    const resources = {
        getSDD: `Get ${vars[0]} Same-Day Delivery`,
        free: 'FREE',
        startSavingWithSDU: `Start saving with a ${vars[0]} of Sephora Same-Day Unlimited.`,
        free30DayTrial: 'FREE 30-day trial',
        tryNowForFree: 'Try Now For Free',
        getFreeSDD: 'Get FREE Same-Day Delivery',
        startSavingWithSephoraSDU: 'Start saving with Sephora Same-Day Unlimited.',
        signUp: 'Sign Up'
    };

    return resources[label];
}
