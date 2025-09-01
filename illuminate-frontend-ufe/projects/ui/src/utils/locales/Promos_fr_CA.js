export default function getResource(label, vars = []) {
    const resources = {
        promoWarning: 'Avertissement code promotionnel/de récompense',
        promoConfirmationTitle: 'Promotion utilisée',
        promoConfirmationMessage: 'Votre promotion a été ajoutée à votre panier.',
        ok: 'OK',
        promoErrorTitle: 'Erreur liée à la promo',
        promoOopsTitle: 'Oups!',
        gotIt: 'Compris'
    };

    return resources[label];
}
