const resources = {
    signInFree: 'Ouvrir une session pour profiter de l’expédition GRATUITE',
    signInAccount: 'Pas de compte?',
    signInAccountLink: 'Créer un compte',
    signInCTA: 'Ouvrir une session',
    status: 'Vous êtes',
    points: 'avec',
    join: 'S’inscrire à Beauty Insider',
    earn: 'pour accumuler des points à chaque achat.',
    ccRewards: 'Récompenses Carte de crédit'
};

export default function getResource(label) {
    return resources[label];
}
