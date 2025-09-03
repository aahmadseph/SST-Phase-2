export default function getResource(label, vars = []) {
    const resources = {
        happening: 'En cours chez Sephora',
        find: 'Trouver un magasin Sephora'
    };

    return resources[label];
}
