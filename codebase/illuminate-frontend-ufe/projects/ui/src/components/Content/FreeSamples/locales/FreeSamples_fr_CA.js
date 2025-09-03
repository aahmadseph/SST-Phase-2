export default function getResource(label, vars = []) {
    const resources = {
        title: 'Choisissez vos échantillons gratuits',
        youCanSelect: 'Vous pouvez sélectionner jusqu’à deux (2) échantillons par commande.',
        countMessage: `Vous avez ajouté ${vars[0]} échantillon(s) sur deux (2)`
    };

    return resources[label];
}
