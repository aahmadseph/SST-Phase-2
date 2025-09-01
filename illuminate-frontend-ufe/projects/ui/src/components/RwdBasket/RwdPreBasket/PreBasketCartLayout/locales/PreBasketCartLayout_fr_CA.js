export default function getResource(label, vars=[]) {
    const resources = {
        seeAll: 'Voir tous les',
        xItems: `${vars[0]} articles`,
        checkout: 'Voir les articles et passer à la caisse'
    };

    return resources[label];
}
