export default function getResource(label, vars = []) {
    const resources = {
        joinButton: 'Join',
        createAccount: 'Create An Account'
    };

    return resources[label];
}
