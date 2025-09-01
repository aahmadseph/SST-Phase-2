export default function getResource(label, vars = []) {
    const resources = {
        pageNotCurrentlyAvailable: 'This page is not currently available. Please try again later.',
        continueShopping: 'Continue Shopping'
    };
    return resources[label];
}
