export default function getResource(label, vars = []) {
    const resources = {
        userLabelText: `You must be a ${vars[0]} to qualify for this product.`,
        signIn: 'Sign in',
        or: 'or',
        signUp: 'Sign up',
        learnMore: 'Learn more'
    };
    return resources[label];
}
