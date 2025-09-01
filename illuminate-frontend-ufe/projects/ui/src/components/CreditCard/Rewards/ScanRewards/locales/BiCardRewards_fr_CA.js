export default function getResource(label, vars = []) {
    const resources = {
        showCard: 'Afficher la carte',
        point: 'Point',
        points: 'Points'
    };

    return resources[label];
}
