export default function getResource(label) {
    const resources = {
        signInText: 'Sign In',
        joinNowText: 'Join Now'
    };

    return resources[label];
}
