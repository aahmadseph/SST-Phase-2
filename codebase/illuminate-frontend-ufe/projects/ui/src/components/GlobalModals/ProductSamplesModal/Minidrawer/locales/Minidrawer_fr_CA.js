export default function getResource(label, vars = []) {
    const resources = {
        samplesInBasket: 'Échantillons dans le panier',
        showMore: 'Afficher plus',
        showLess: 'Afficher moins',
        done: 'Terminé'
    };

    return resources[label];
}
