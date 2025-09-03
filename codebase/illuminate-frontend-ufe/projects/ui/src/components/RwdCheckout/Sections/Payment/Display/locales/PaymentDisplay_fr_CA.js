export default function getResource(label, vars = []) {
    const resources = {
        defaultCard: 'Carte par défaut',
        expires: 'Expire le',
        payPalAccount: 'Compte PayPal',
        payWithPayPal: 'Payer avec PayPal',
        payNow: 'Payez maintenant',
        or: 'ou',
        payLaterWithPayPal: 'Payez plus tard avec PayPal',
        payWithApplePay: 'Payer avec ApplePay',
        payWithKlarna: `Payez en quatre versements sans intérêt de ${vars[0]}`,
        payWithAfterpay: `Payez en quatre versements sans intérêt de ${vars[0]}`,
        payWithPaze: 'Payez avec Paze',
        payWithVenmo: 'Payez avec Venmo',
        storeCreditApplied: 'Crédit au compte appliqué',
        endingIn: 'se terminant par',
        paymentDisabled: `${vars[0]} ne peut pas être utilisée pour les achats de cartes-cadeaux, d’abonnements ou de rendez-vous en magasin, pour les récompenses Carte de crédit Sephora, ni pour les commandes de ${vars[1]} ou plus.`,
        venmoDisabled: 'Venmo ne peut pas être utilisé pour les achats d’abonnements ou de rendez-vous en magasin; avec les récompenses de la carte de crédit Sephora',
        pazePaymentDisabled: 'Paze ne peut pas être utilisé pour les achats de cartes-cadeaux, d’abonnements ou de rendez-vous en magasin; avec les récompenses de la carte de crédit Sephora.',
        payPalDisabled: 'PayPal ne peut pas être utilisé pour l’achat d’un abonnement.',
        paymentGiftCardMessage: `Les cartes-cadeaux ne peuvent être combinées à ${vars[0]}. Si vous voulez utiliser une carte-cadeau, veuillez choisir un autre mode de paiement.`,
        payzeAvailabilty: 'Offert aux consommateurs des banques participantes et des coopératives d’épargne et de crédit',
        pazeErrorMessage: 'Nous sommes désolés, nous ne pouvons pas autoriser votre paiement Paze. Veuillez sélectionner un autre mode de paiement.',
        pazeErrorTitle: 'Erreur',
        pazeErrorOk: 'OK',
        pazePolicy: 'En cliquant sur « Continuer vers Paze », je demande à Sephora d’envoyer mes renseignements de commande et de facturation à Paze et je comprends que ces renseignements seront assujettis aux conditions de Paze et à sa politique de confidentialité.'
    };

    return resources[label];
}
