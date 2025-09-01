export default function getResource(label, vars = []) {
    const resources = {
        updatedLabel: 'MIS À JOUR',
        applyText: 'Appliquer',
        viewPromoCodesText: 'Voir les offres en vedette',
        ccPromoLabel: 'Code promo',
        promoLabel: 'Code promo',
        gotIt: 'Compris',
        youCanAddPromos: 'Certaines promotions ne s’appliquent pas aux commandes à ramasser. Vous pouvez ajouter des récompenses en magasin, s’il y a lieu.',
        viewFeaturedOffers: 'Voir les offres en vedette',
        collapsePromoField: 'Ajouter un code promotionnel ou de récompense',
        enterPromoCode: 'Inscrire le code promo'
    };

    return resources[label];
}
