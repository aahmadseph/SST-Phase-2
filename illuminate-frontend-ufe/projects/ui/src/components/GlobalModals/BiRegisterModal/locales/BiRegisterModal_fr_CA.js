export default function getResource(label, vars = []) {
    const resources = {
        joinButton: 'S’inscrire',
        createAccount: 'Créer un compte'
    };

    return resources[label];
}
