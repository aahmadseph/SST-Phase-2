export default function getResource(label, vars = []) {
    const resources = {
        goingFast: 'Going Fast',
        limitedSupply: 'Limited Supply',
        viewFullSize: 'View Full Size',
        viewDetails: 'View Details',
        remove: 'Remove',
        addToBasket: 'Add to Basket',
        quickLook: 'Quick Look',
        productPreview: 'Product Preview',
        free: 'FREE'
    };

    return resources[label];
}
