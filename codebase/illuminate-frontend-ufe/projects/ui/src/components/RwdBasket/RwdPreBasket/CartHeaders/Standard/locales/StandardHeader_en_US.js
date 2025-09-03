export default function getResource(label, vars = []) {
    const resources = {
        standard: 'Get It Shipped'
    };
    return resources[label];
}
