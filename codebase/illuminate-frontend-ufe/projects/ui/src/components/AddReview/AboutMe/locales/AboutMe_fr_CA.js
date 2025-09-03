export default function getResource(label) {
    const resources = {
        aboutYou: 'À propos de vous',
        optionalInformation: 'Ces informations optionnelles rendent votre avis encore plus utile pour les autres clients.',
        postReview: 'Publier un commentaire'
    };
    return resources[label];
}
