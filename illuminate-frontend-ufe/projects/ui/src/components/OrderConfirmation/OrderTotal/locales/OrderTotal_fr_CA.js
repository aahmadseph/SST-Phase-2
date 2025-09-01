export default function getResource (label, vars = []) {
    const resources = {
        estimatedOrderTotal: 'Total estimé',
        orderSubTotalWithTax: 'Sous-total de la commande et taxes estimées',
        oneTimeReplacementFee: 'Remplacement unique',
        orderTotal: 'Total de la commande',
        merchandiseSubtotal: 'Sous-total des marchandises',
        pointsUsed: 'Points utilisés',
        pointsUsedInThisOrder: 'Points utilisés (dans cet ordre)',
        shippingAndHandling: 'Expédition et manutention',
        shippingAndHandlingInfo: 'Renseignements sur l’expédition et la manutention',
        discounts: 'Réductions',
        gstOrHst: 'TPS/TVH',
        estimatedGstOrHst: 'TPS/TVH estimées',
        pst: 'TVP',
        estimatedPst: 'TVP estimée',
        tax: 'Taxe',
        estimatedTax: 'Taxes estimées',
        storeCreditRedeemed: 'Crédit au compte',
        giftCardRedeemed: 'Carte-cadeau échangée',
        eGiftCardRedeemed: 'Carte-cadeau électronique utilisée',
        creditCardPayment: 'Paiement par carte de crédit',
        payPalPayment: 'Paiement PayPal',
        viewOrCancel: 'Pour consulter ou annuler votre commande, rendez-vous sur',
        orderDetails: 'détails de la commande',
        pickup: 'Ramassage',
        free: 'GRATUIT',
        autoReplenishSavings: 'Économies sur le réapprovisionnement automatique',
        sduBIPointsText: 'Vous accumulerez des points Beauty Insider dès que vous commencerez à payer votre abonnement.',
        sddIncreasedAuthorizationWarning: `{*}Le total estimé est basé sur les articles de premier choix. *Votre méthode de paiement sera temporairement autorisée pour un montant de ${vars[0]}*, afin de couvrir les substitutions potentielles d’articles. Seuls les articles que vous recevrez seront facturés. La transaction sera finalisée lorsque votre commande sera livrée. Les promotions peuvent être retirées si des articles sont remplacés. Votre total final sera affiché sur votre reçu envoyé par courriel et dans l’historique des commandes. L’autorisation temporaire sera retirée par votre institution financière 3 à 5 jours après la réception de vos articles. Veuillez communiquer avec votre institution financière pour toute question relative aux autorisations temporaires.`
    };

    return resources[label];
}
