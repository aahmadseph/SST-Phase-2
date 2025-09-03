export default function getResource(label, vars = []) {
    const resources = { relatedLinksLabel: 'Related Pages' };
    return resources[label];
}
