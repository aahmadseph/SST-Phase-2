export default function getResource(label, vars = []) {
    const resources = {
        instructions: 'Choisissez jusqu’à 3 échantillons gratuits par commande avec un achat minimum de 25 $. Selon la disponibilité.'
    };

    return resources[label];
}
