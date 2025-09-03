export default function getResource(label, vars = []) {
    const resources = {
        estimatedTotal: 'Total estimé',
        items: 'Articles',
        shippingAndTaxes: 'Les frais d’expédition et les taxes seront calculés à la caisse.',
        bopisTaxes: 'Les taxes seront calculées à la caisse.',
        youSave: 'Vous économisez',
        sduSavingsUS: '6,95 $',
        sduSavingsCA: '9,95 $',
        maxAuthAmountMessage: '{*}Basé sur les articles de premier choix. *Votre mode de paiement sera temporairement autorisé pour un montant supplémentaire*. {color:blue}+Voir les modalités complètes.+{color}',
        withSDUUnlimited: 'avec la livraison le jour même illimitée',
        paymentLegal: 'Certains modes de paiement peuvent ne pas être disponibles pour certains articles ou certaines méthodes.',
        supportedPayment: 'Modes de paiement pris en charge',
        sddIncreasedAuthorizationWarning: '{*}Le total estimé est basé sur les articles de premier choix. *Votre méthode de paiement sera temporairement autorisée pour un montant supplémentaire*, afin de couvrir les substitutions potentielles d’articles. Seuls les articles que vous recevrez seront facturés. La transaction sera finalisée lorsque votre commande sera livrée. Les promotions peuvent être retirées si des articles sont remplacés. Votre total final sera affiché sur votre reçu envoyé par courriel et dans l’historique des commandes. L’autorisation temporaire sera retirée par votre institution financière 3 à 5 jours après la réception de vos articles. Veuillez communiquer avec votre institution financière pour toute question relative aux autorisations temporaires.',
        bopisIncreasedAuthorizationWarning: `{*}Le total estimé est basé sur les articles de premier choix. Votre méthode de paiement sera *temporairement autorisée pour un montant de *${vars[0]}, afin de couvrir les substitutions potentielles d’articles. Seuls les articles que vous recevrez seront facturés. La transaction sera finalisée lorsque votre commande sera livrée. Les promotions peuvent être retirées si des articles sont remplacés. Votre total final sera affiché sur votre reçu envoyé par courriel et dans l’historique des commandes. L’autorisation temporaire sera retirée par votre institution financière 3 à 5 jours après la réception de vos articles. Veuillez communiquer avec votre institution financière pour toute question relative aux autorisations temporaires. {color:blue}+Voir les modalités complètes.+{color}`,
        placeOrder: 'Passer commande',
        continue: 'Continuer',
        reviewTerms: 'Veuillez lire les conditions pour passer la commande',
        sddSubstituteDisclaimer: '* Basé sur les articles de premier choix. Votre mode de paiement sera',
        temporarilyAuthorized: 'temporairement autorisé',
        forText: 'pour',
        seeFullTerms: 'Voir les modalités complètes.',
        orderCostSummaryText: 'Sous-total de la commande',
        originalPrice: 'Prix courant',
        finalTotal: 'Total',
        mobilePlaceOrderSection: 'Section Passer la commande sur un appareil mobile',
        sameDayDeliveryAuthorizationNotice: 'Avis d’autorisation de livraison le jour même',
        openNewWindowText: 's’ouvre dans une nouvelle fenêtre',
        orderTotalAndPlaceOrderSection: 'Section Total de la commande et Passer la commande'
    };

    return resources[label];
}
