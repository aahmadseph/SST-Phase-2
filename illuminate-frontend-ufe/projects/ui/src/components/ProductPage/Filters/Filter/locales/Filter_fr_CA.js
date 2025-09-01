export default function getResource(label, vars = []) {
    const resources = {
        done: 'Terminé',
        clear: 'Réinitialiser'
    };
    return resources[label];
}
