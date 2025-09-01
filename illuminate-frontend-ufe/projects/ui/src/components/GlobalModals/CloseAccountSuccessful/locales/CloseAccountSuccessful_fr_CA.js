export default function getResource(label) {
    const resources = {
        accountClosed: 'Compte fermé avec succès',
        loggedOut: 'Vous êtes maintenant déconnecté.',
        message: 'Si vous avez des questions concernant la fermeture de votre compte, veuillez communiquer avec notre équipe du service à la clientèle au',
        or: 'ou',
        chatWithUs: 'Clavardez avec nous'
    };
    return resources[label];
}

