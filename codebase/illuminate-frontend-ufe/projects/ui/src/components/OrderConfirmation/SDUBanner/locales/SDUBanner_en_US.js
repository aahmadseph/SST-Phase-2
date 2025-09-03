export default function getResource(label, vars = []) {
    const resources = {
        welcomeMessage: 'Welcome to Same-Day Unlimited',
        youSaved: 'You saved',
        savingsAmountUS: '$6.95',
        savingsAmountCA: '$9.95',
        todaysOrder: 'on today’s order.'
    };

    return resources[label];
}
