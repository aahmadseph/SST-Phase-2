export default function getResource(label, vars = []) {
    const resources = {
        accessMessage1: 'Il semble que vous essayez d’accéder ',
        accessMessage2: 'à partir d’un autre pays.',
        doesNotShip: 'Ce site n’expédie pas vers votre pays.',
        internationalSites: 'Consultez les sites Web de Sephora International',
        continue: 'Continuer vers '
    };

    return resources[label];
}
