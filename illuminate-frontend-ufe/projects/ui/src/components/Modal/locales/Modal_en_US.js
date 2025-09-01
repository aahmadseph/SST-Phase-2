export default function getResource(label, vars = []) {
    const resources = {
        continueShopping: 'Continue shopping',
        closeButton: 'Close modal'
    };
    return resources[label];
}
