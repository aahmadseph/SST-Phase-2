export default function getResource(label, vars = []) {
    const resources = {
        add: 'Ajouter',
        remove: 'Retirer',
        addedText: 'Ajouté'
    };

    return resources[label];
}
