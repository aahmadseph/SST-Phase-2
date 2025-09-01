export default function getResource(label, vars = []) {
    const resources = {
        color: 'Couleur',
        readMore: 'En lire plus',
        thumbnailADAAltText: 'Image générée par l’utilisateur',
        recommendsProduct: 'Recommandé',
        showMore: 'Afficher plus',
        negativeFeedbackButtonLabel: `Inutile (${vars[0]})`,
        positiveFeedbackButtonLabel: `Utile (${vars[0]})`,
        verifiedPurchase: 'Achat vérifié',
        sephoraEmployee: 'Employé de Sephora',
        receivedFreeProduct: 'A reçu un produit gratuit pour évaluation'
    };
    return resources[label];
}
