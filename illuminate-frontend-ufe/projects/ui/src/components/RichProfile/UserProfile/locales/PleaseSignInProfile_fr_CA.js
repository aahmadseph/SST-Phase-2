export default function getResource(label, vars = []) {
    const resources = {
        please: 'Veuillez',
        signIn: 'ouvrir une session',
        toViewThisPage: 'pour afficher cette page.'
    };
    return resources[label];
}
