export default function getResource(label) {
    const resources = {
        signInText: 'Ouvrir une session',
        joinNowText: 'S’inscrire'
    };

    return resources[label];
}
