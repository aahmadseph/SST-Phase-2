export default function getResource(label, vars = []) {
    const resources = {
        please: 'Veuillez',
        toReviewSection: 'pour consulter cette rubrique.',
        signIn: 'ouvrir une session'
    };

    return resources[label];
}
