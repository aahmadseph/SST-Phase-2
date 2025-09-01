
export default function getResource(label, vars = []) {
    const resources = {
        shopFaves: 'Dénichez parmi vos favoris',
        fromLovesList: 'De votre liste de favoris.',
        viewAll: 'Tout afficher'
    };
    return resources[label];
}
