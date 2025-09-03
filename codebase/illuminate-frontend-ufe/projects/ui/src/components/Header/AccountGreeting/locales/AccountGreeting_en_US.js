const resources = {
    lead: 'Sign in for *FREE standard shipping* on all orders.',
    signIn: 'Sign In',
    createAccount: 'Create Account'
};

export default function getResource(label) {
    return resources[label];
}
