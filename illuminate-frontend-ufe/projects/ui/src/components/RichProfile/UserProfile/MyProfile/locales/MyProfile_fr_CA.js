export default function getResource(label, vars = []) {
    const resources = {
        toViewYourProfilePlease: 'Pour afficher votre profil, veuillez',
        signIn: 'ouvrir une session',
        notifications: 'Notifications',
        messages: 'Messages'
    };
    return resources[label];
}
