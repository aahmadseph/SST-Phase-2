export default function getResource(label, vars = []) {
    const resources = {
        beautyMatch: 'Correspondance beauté',
        beautyMatches: 'Correspondances beauté'
    };
    return resources[label];
}
