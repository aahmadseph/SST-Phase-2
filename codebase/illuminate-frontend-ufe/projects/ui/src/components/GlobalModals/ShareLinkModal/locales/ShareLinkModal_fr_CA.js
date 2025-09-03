export default function getResource(label, vars = []) {
    const resources = {
        share: 'Partager',
        copied: 'Copié',
        copy: 'Copier'
    };
    return resources[label];
}
