export default function getResource(label, vars = []) {
    const resources = {
        toViewYourProfilePlease: 'To view your profile, please',
        signIn: 'sign in',
        notifications: 'Notifications',
        messages: 'Messages'
    };
    return resources[label];
}
