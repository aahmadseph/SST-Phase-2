export default function getResource(label, vars = []) {
    const resources = {
        ready: 'Ready to get rewarded?',
        joinNow: 'Join Now',
        alreadyBI: 'Already a Beauty Insider?',
        signIn: 'Sign In'
    };

    return resources[label];
}
