export default function getResource(label, vars = []) {
    const resources = {
        showCard: 'Show Card',
        point: 'Point',
        points: 'Points'
    };

    return resources[label];
}
