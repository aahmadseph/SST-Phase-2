export default function getResource(label, vars = []) {
    const resources = {
        unfollow: 'Ne plus suivre',
        follow: 'S’abonner',
        sendMessage: 'Envoyer un message'
    };
    return resources[label];
}
