export default function getResource(label, vars = []) {
    const resources = {
        viewIngredientList: 'Afficher la liste des ingrédients',
        ingredientPreferencesTitle: 'Sélectionner Préférences ingrédients',
        ingredientPreferencesSearchText: 'Rechercher ingrédients',
        viewAllBrands: 'Voir toutes les marques',
        favoriteBrandsTitle: 'Sélectionner vos marques favorites',
        favoriteBrandsSearchText: 'Rechercher la marque'
    };
    return resources[label];
}
