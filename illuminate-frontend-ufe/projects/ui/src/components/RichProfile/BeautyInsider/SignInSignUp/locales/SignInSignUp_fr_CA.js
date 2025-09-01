export default function getResource(label, vars = []) {
    const resources = {
        ready: 'Prêt à obtenir votre récompense?',
        joinNow: 'S’inscrire',
        alreadyBI: 'Déjà membre Beauty Insider?',
        signIn: 'Ouvrir une session'
    };

    return resources[label];
}
