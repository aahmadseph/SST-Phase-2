export default function getResource(label) {
    const resources = { componentNotFound: 'Component not found' };
    return resources[label];
}
