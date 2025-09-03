export default function getResource(label, vars = []) {
    const resources = {
        productPrice: 'Price',
        fillSize: 'Fill Size',
        rating: 'Rating',
        ingredientHighlights: 'Ingredient Highlights',
        seeDetails: 'See Details',
        value: 'value'
    };

    return resources[label];
}
