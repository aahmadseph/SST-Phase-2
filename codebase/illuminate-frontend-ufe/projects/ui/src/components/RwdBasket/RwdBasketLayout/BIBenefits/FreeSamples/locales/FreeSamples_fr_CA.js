export default function getResource(label, vars = []) {
    const resources = {
        samplesText: 'Choisissez jusqu’à 2 échantillons gratuits',
        samplesSubText: `<b>${vars[0]} de 2</b> ajouté pour la livraison`
    };

    return resources[label];
}
