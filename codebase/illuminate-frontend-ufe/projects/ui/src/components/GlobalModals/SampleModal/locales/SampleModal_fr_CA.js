export default function getResource(label, vars = []) {
    const resources = {
        selectUpToSamples: `Sélectionnez jusqu’à ${vars[0]} échantillon(s)`,
        alterTitle: 'Choisissez jusqu’à 2 échantillons gratuits',
        done: 'Terminé'

    };

    return resources[label];
}
