export default function getResource(label, vars = []) {
    const resources = {
        shippingAndHandling: 'Expédition et manutention',
        discounts: 'Réductions',
        bagFee: 'Frais de sac',
        specialFee: 'Frais spéciaux',
        gstOrHst: 'TPS/TVH estimées',
        pst: 'TVP estimée',
        tax: 'Taxes estimées',
        storeCreditRedeemed: 'Crédit au compte',
        giftCardRedeemed: 'Carte-cadeau échangée',
        eGiftCardRedeemed: 'Carte-cadeau électronique utilisée'
    };

    return resources[label];
}
