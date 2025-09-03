
export default function getResource(label, vars = []) {
    const resources = {
        close: 'Fermer',
        view: 'Afficher'
    };
    return resources[label];
}
