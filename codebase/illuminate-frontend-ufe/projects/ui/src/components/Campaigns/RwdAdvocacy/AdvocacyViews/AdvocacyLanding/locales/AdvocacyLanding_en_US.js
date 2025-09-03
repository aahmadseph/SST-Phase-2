export default function getResource(label) {
    const resources = {
        joinNow: 'Join Now',
        createAccount: 'Create Account',
        signIn: 'Sign In'
    };

    return resources[label];
}
