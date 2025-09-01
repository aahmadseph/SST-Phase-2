export default function getResource(label, vars = []) {
    const resources = {
        deliveryEvery: 'Livrer chaque :',
        deliveryFrequency: 'Fréquence de livraison'
    };

    return resources[label];
}
