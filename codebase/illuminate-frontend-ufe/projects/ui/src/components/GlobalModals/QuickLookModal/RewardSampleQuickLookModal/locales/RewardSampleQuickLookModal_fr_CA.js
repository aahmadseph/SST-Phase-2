export default function getResource(label, vars = []) {
    const resources = {
        goingFast: 'Produits qui partent vite',
        limitedSupply: 'Stock limité',
        viewFullSize: 'Voir en format standard',
        viewDetails: 'Voir les détails',
        remove: 'Retirer',
        addToBasket: 'Ajouter au panier',
        quickLook: 'Aperçu rapide',
        productPreview: 'Aperçu du produit',
        free: 'GRATUIT'
    };

    return resources[label];
}
