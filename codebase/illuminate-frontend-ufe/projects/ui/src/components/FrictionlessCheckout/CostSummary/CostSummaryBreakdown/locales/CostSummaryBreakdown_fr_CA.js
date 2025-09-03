export default function getResource(label, vars = []) {
    const resources = {
        merchandiseSubtotalText: 'Sous-total',
        pointsUsed: 'Points utilisés (dans cet ordre)',
        discountsText: 'Réductions',
        free: 'GRATUIT',
        tbdText: 'À déterminer',
        shippingAndHandlingText: 'Livraison',
        autoReplenishSavings: 'Économies sur le réapprovisionnement automatique',
        gstHstText: 'TPS/TVH estimées',
        taxText: 'Taxes estimées',
        pickup: 'Ramassage',
        bagFee: 'Frais de sac',
        pst: 'TVP estimée',
        storeCreditRedeemed: 'Crédit au compte',
        giftCardRedeemed: 'Carte-cadeau échangée',
        eGiftCardRedeemed: 'Carte-cadeau électronique utilisée',
        creditCardPayment: 'Paiement par carte de crédit',
        payPalPayment: 'Paiement PayPal',
        otherFees: 'et autres frais',
        information: 'informations',
        moreInfo: 'Plus d’information'
    };

    return resources[label];
}
