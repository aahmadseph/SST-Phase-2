export default function getResource(label, vars = []) {
    const resources = {
        bopisIncreasedAuthorizationWarning: `{*}Le total estimé est basé sur les articles de premier choix. *Votre méthode de paiement sera temporairement autorisée pour un montant de ${vars[0]}*, afin de couvrir les substitutions potentielles d’articles. Seuls les articles que vous recevrez seront facturés. La transaction sera finalisée lorsque vous ramasserez la commande. Les promotions peuvent être retirées si des articles sont remplacés. Votre total final sera affiché sur votre reçu envoyé par courriel et dans l’historique des commandes. L’autorisation temporaire sera retirée par votre institution financière 3 à 5 jours après la réception de vos articles. Veuillez communiquer avec votre institution financière pour toute question relative aux autorisations temporaires.`,
        merchandiseSubtotalText: 'Sous-total des marchandises',
        pickup: 'Ramassage',
        free: 'GRATUIT',
        estimatedTaxText: 'Taxes estimées',
        estimatedTaxCA: 'TVH/TPS/TVP estimées',
        estimatedTotalText: 'Total estimé',
        paymentText: 'Le paiement sera perçu en magasin.',
        reservationDetailsButtonText: 'Voir les détails de la réservation',
        completeReservation: 'Compléter la réservation',
        bagFeeText: 'Frais de sac',
        specialFeeText: 'Frais spéciaux',
        discountsText: 'Réductions',
        eGiftCardRedeemedText: 'Carte-cadeau électronique utilisée',
        payPalPaymentText: 'Paiement PayPal',
        giftCardRedeemedText: 'Carte-cadeau échangée',
        creditCardPaymentText: 'Paiement par carte de crédit',
        storeCredit: 'Crédit magasin',
        beautyInsiderPoints: 'Vous accumulerez des points Beauty Insider pour cet achat après avoir ramassé votre commande.',
        orderTotal: 'Total de la commande',
        gotIt: 'Compris',
        salesTax: 'Taxe de vente',
        tax: 'Taxe',
        caTax: 'TVH/TPS/TVP',
        pointsUsedInThisOrder: 'Points utilisés (dans cet ordre)'
    };

    return resources[label];
}
