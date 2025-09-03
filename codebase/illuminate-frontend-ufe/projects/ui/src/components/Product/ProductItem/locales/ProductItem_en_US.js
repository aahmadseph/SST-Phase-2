export default function getResource(label, vars = []) {
    const resources = {
        viewSimilarProductsText: 'View similar products',
        writeReviewText: 'Write A Review',
        moreColor: 'more color',
        moreColors: 'more colors',
        itemShip: 'This item cannot be shipped to',
        canada: ' Canada',
        us: ' the United States',
        color: 'Color: ',
        value: 'value'
    };

    return resources[label];
}
