export default function getResource(label, vars = []) {
    const resources = {
        done: 'Terminé',
        all: 'Tous',
        clear: 'Réinitialiser',
        shade: 'Teinte'
    };
    return resources[label];
}
