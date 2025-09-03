export default function getResource(label, vars = []) {
    const resources = {
        estimatedTotalXItems: `Total estimé (${vars[0]} articles)`,
        estimatedTotal: 'Total estimé',
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
        bopisIncreasedAuthorizationWarning: '{*}Le total estimé est basé sur les articles de premier choix. *Votre méthode de paiement sera temporairement autorisée pour un montant supplémentaire*, afin de couvrir les substitutions potentielles d’articles. Seuls les articles que vous recevrez seront facturés. La transaction sera finalisée lorsque vous ramasserez la commande. Les promotions peuvent être retirées si des articles sont remplacés. Votre total final sera affiché sur votre reçu envoyé par courriel et dans l’historique des commandes. L’autorisation temporaire sera retirée par votre institution financière 3 à 5 jours après la réception de vos articles. Veuillez communiquer avec votre institution financière pour toute question relative aux autorisations temporaires.',
        viewBasketSummary: 'Afficher le sommaire du panier'
    };

    return resources[label];
}
