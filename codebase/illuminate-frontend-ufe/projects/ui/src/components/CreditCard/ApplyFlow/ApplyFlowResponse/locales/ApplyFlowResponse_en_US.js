export default function getResource(label) {
    const resources = {
        creditLimit: 'Credit Limit:',
        viewDetails: 'View Details',
        continueShoppingButton: 'Continue Shopping'
    };

    return resources[label];
}
