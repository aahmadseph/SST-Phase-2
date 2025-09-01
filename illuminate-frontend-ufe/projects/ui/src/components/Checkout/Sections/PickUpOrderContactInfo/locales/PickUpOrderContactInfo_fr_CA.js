export default function getResource(label) {
    const resources = {
        contactMessage1: 'Veuillez avoir en main votre ',
        confirmEmail: 'courriel de confirmation ',
        or: 'ou ',
        photoId: 'une pièce d’identité avec photo ',
        ready: 'au moment du ramassage de votre commande.'
    };

    return resources[label];
}
