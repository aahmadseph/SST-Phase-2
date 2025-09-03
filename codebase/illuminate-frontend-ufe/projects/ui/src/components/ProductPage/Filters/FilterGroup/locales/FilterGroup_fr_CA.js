export default function getResource(label, vars = []) {
    const resources = {
        done: 'Terminé',
        clear: 'Incolore'
    };
    return resources[label];
}
