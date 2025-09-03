export default function getResource(label) {
    const resources = {
        qrComponentTitle: 'Vous avez déjà l’application?',
        qrComponentText: 'Balayez ce code QR pour commencer maintenant.'
    };

    return resources[label];
}
