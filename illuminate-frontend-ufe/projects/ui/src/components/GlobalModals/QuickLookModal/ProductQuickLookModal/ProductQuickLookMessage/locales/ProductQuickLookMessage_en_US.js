export default function getResource(label, vars = []) {
    const resources = {
        beautyInsider: 'an Insider',
        rouge: 'Rouge',
        vib: 'VIB',
        signIn: 'Sign in',
        signUp: 'Sign up',
        youMust: 'You must be',
        toAccess: 'to access this product',
        learnMore: 'Learn more'
    };

    return resources[label];
}
