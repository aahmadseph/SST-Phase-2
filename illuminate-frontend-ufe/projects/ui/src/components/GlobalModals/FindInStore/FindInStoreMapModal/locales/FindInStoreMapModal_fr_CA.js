export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Détails du magasin',
        backToList: 'Retour à la liste des magasins'
    };

    return resources[label];
}
