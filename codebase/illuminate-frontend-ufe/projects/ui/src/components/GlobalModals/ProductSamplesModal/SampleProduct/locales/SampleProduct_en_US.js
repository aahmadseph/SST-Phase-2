export default function getResource(label, vars=[]) {
    const resources = {
        outOfStock: 'Out of Stock'
    };

    return resources[label];
}
