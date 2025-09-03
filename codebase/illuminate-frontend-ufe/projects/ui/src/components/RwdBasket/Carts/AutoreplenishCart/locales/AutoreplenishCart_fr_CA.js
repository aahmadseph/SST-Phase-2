export default function getResource(label, vars = []) {
    const resources = {
        autoReplenishTitle: `Réapprovisionnement automatique (${vars[0]})`,
        changeMethod: 'Changer la méthode'
    };

    return resources[label];
}
