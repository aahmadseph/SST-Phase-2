export default function getResource(label, vars = []) {
    const resources = {
        accessMessage1: 'Looks like you are trying to access ',
        accessMessage2: 'from another country.',
        doesNotShip: 'This site does not ship to your country.',
        internationalSites: 'View Sephora International Websites',
        continue: 'Continue to '
    };

    return resources[label];
}
