export default function getResource(label, vars = []) {
    const resources = {
        userLabelText: `Vous devez être membre ${vars[0]} pour obtenir ce produit.`,
        signIn: 'Ouvrir une session',
        or: 'ou',
        signUp: 'S’inscrire',
        learnMore: 'En savoir plus'
    };
    return resources[label];
}
