export default function getResource(label) {
    const resources = {
        qrComponentTitle: 'Already have the app?',
        qrComponentText: 'Scan this QR code to get started now.'
    };

    return resources[label];
}
