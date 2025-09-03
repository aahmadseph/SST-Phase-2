export default function getResource(label, vars = []) {
    const resources = {
        basket: 'panier',
        checkout: 'Passer à la caisse',
        item: 'article',
        total: `Vous avez ${vars[0]} dans votre ${vars[1]}.`,
        applyPoints: 'Échangez *500 points * pour* profiter d’une réduction de 10 $%%*  à la caisse',
        freeShipping: 'Expédition standard GRATUITE'
    };

    return resources[label];
}
