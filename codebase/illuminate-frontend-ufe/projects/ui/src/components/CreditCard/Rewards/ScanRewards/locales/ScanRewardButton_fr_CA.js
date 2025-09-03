export default function getResource(label, vars = []) {
    const resources = { showBarcode: 'Show Barcode' };

    return resources[label];
}
