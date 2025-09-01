export default function getResource(label, vars = []) {
    const resources = {
        limitedSupply: 'Stock limité',
        goingFast: 'Produits qui partent vite',
        signInToAccess: 'Accéder au compte',
        addFullSize: 'Ajouter le produit en format standard',
        addToBasket: 'Ajouter au panier',
        addToBasketShort: 'Ajouter',
        remove: 'Retirer',
        writeAReview: 'Rédiger une évaluation',
        free: 'GRATUIT',
        birthday: 'cadeau d’anniversaire',
        priceInPoints: `${vars[0]} points`
    };

    return resources[label];
}
