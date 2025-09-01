export default function getResource(label) {
    const resources = {
        joinNow: 'S’inscrire',
        createAccount: 'Créer un compte',
        signIn: 'Ouvrir une session'
    };

    return resources[label];
}
