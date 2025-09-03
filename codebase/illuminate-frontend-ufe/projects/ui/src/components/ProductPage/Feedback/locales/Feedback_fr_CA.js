export default function getResource(label) {
    const resources = {
        helpful: 'Utile?',
        thanks: 'Merci pour vos commentaires'
    };
    return resources[label];
}
