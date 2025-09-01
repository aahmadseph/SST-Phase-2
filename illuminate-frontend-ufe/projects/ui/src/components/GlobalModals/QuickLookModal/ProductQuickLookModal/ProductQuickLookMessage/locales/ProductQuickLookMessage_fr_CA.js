export default function getResource(label, vars = []) {
    const resources = {
        beautyInsider: 'êtes un membre Insider',
        rouge: 'Rouge',
        vib: 'VIB',
        signIn: 'Ouvrir une session',
        signUp: 'S’inscrire',
        youMust: 'Vous devez être',
        toAccess: 'pour profiter de ce produit',
        learnMore: 'En savoir plus'
    };

    return resources[label];
}
