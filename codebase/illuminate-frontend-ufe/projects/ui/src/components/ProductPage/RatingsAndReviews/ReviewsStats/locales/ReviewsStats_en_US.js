export default function getResource(label, vars = []) {
    const resources = {
        recommended: 'Recommended',
        reviews: 'Reviews',
        summary: 'Summary'
    };
    return resources[label];
}
