export default function getResource(label, vars = []) {
    const resources = {
        orderInfo: 'Informations relatives à la commande',
        productInfo: 'Information sur les produits',
        beautyInsider: 'Beauty Insider',
        passwordReset: 'Réinitialisation du mot de passe',
        askBeautyAdviser: 'Demander à un conseiller beauté',
        retailStoreInfo: 'Renseignements sur le magasin',
        websiteFeedback: 'Commentaires sur le site Web',
        complimentComplaint: 'Compliment ou plainte',
        general: 'Commentaires généraux ou questions',
        ratingsReviews: 'Évaluations'
    };

    return resources[label];
}
