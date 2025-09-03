export default function getResource(label, vars = []) {
    const resources = {
        orderText: 'Commande',
        dateLocationText: 'Date et lieu'
    };

    return resources[label];
}
