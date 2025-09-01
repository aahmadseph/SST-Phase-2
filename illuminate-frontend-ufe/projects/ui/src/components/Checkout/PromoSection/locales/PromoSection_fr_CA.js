export default function getResource(label, vars = []) {
    const resources = {
        updatedLabel: 'MIS À JOUR',
        applyText: 'Appliquer',
        appliedText: 'Appliqué',
        removeText: 'Retirer',
        viewPromoCodesText: 'Voir les offres en vedette',
        ccPromoLabel: 'Code promotionnel ou de récompense',
        promoLabel: 'Code promo',
        gotIt: 'Compris',
        youCanAddPromos: 'Certaines promotions ne s’appliquent pas aux commandes à ramasser. Vous pouvez ajouter des récompenses en magasin, s’il y a lieu.'
    };

    return resources[label];
}
