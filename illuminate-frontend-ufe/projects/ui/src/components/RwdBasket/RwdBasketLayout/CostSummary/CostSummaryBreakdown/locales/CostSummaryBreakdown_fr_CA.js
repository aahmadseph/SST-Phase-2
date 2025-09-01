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
        bagFee: 'Frais du sac de ramassage'
    };

    return resources[label];
}
