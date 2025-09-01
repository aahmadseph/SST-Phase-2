export default function getResource(label, vars = []) {
    const resources = { seeDetails: 'Voir les détails' };
    return resources[label];
}
