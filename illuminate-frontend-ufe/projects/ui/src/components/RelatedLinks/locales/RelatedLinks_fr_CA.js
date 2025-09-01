export default function getResource(label, vars = []) {
    const resources = { relatedLinksLabel: 'Pages liées' };
    return resources[label];
}
