export default function getResource(label, vars = []) {
    const resources = {
        title: `Ajouter jusqu’à ${vars[0]} échantillons gratuits`,
        done: 'Terminé',
        note: 'Remarque',
        footerNote: 'Les échantillons dépendent de la disponibilité des stocks.',
        addToBasketShort: 'Ajouter',
        signInToAccess: 'Accéder au compte',
        remove: 'Retirer'
    };

    return resources[label];
}
