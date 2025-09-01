export default function getResource(label, vars = []) {
    const resources = {
        barcodeTitle: 'Your Beauty Insider Card',
        barcodeDesc: 'Scan this barcode at checkout in the store to earn points and redeem rewards.'
    };

    return resources[label];
}
