export default function getResource(label, vars = []) {
    const resources = {
        barcodeTitle: 'Votre carte Beauty Insider',
        barcodeDesc: 'Balayez ce code à barres à la caisse du magasin pour accumuler des points et profiter des récompenses.'
    };

    return resources[label];
}
