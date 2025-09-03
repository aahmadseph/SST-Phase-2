export default function getResource(label, vars = []) {
    const resources = {
        viewIngredientList: 'View Ingredient List',
        ingredientPreferencesTitle: 'Select Ingredient Preferences',
        ingredientPreferencesSearchText: 'Search ingredients',
        viewAllBrands: 'View All Brands',
        favoriteBrandsTitle: 'Select Favorite Brands',
        favoriteBrandsSearchText: 'Search Brand'
    };
    return resources[label];
}
