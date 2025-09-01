export default function getResource(label, vars = []) {
    const resources = {
        justArrived: 'Nouvel arrivage',
        bestsellers: 'Favoris beauté'
    };

    return resources[label];
}
