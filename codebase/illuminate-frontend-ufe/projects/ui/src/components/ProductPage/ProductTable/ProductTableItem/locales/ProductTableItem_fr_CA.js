export default function getResource(label, vars = []) {
    const resources = {
        productPrice: 'Prix',
        fillSize: 'Taille de remplissage',
        rating: 'Cote',
        ingredientHighlights: 'Avantages des ingrédients',
        seeDetails: 'Voir les détails',
        value: 'valeur'
    };

    return resources[label];
}
