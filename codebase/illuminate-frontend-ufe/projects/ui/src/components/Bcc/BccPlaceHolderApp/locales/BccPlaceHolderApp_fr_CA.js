export default function getResource(label) {
    const resources = { componentNotFound: 'Composant introuvable' };
    return resources[label];
}
