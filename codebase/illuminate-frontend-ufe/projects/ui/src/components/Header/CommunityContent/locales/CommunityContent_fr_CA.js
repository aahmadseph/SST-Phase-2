export default function getResource(label, vars = []) {
    const resources = {
        signIn: 'Ouvrir une session',
        createAccount: 'Créer un compte',
        joinNow: 'S’inscrire',
        communityProfile: 'Profil de la collectivité',
        signInPrompt: 'Ouvrez une session pour consulter votre profil',
        joinPrompt: 'Inscrivez-vous maintenant pour commencer',
        yourProfile: 'Votre profil de la collectivité',
        notifications: 'Notifications',
        messages: 'Messages'
    };

    return resources[label];
}
