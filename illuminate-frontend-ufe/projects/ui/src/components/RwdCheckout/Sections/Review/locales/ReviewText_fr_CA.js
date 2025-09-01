export default function getResource(label, vars = []) {
    const common = {
        privacyPolicy: 'politique de confidentialité',
        andConditionsOfUse: 'conditions d’utilisation de Sephora, et j’ai lu ',
        noticeOfFinancialIncentive: 'l’avis de prime financière.',
        noShippingAddressRequired: 'Cette commande ne requiert aucun paiement ou adresse de livraison. Veuillez vérifier vos renseignements avant de passer votre commande.',
        noPaymentRequired: 'Cette commande ne requiert aucun paiement. Veuillez vérifier vos renseignements avant de passer votre commande.',
        pleaseReviewOrder: `Veuillez vérifier les informations de votre commande avant ${vars[0]}`,
        termsConditions: 'Conditions',
        andText: ' et ',
        verifyCVV: 'Aucun paiement n’est requis. Veuillez vérifier votre numéro CVV/CVC à des fins de sécurité. Veuillez vérifier vos renseignements avant de passer votre commande.',
        verifyCVVeFulfilledOrder: 'Cette commande ne requiert aucun paiement ou adresse de livraison. Le CVV/CVC est requis à des fins de sécurité seulement. Veuillez vérifier vos renseignements avant de passer votre commande.',
        pleaseReviewOrderInfoText: 'Veuillez vérifier les informations relatives à votre commande avant de passer votre commande.',
        byPlacingOrderCaText: 'En passant votre commande, vous acceptez de vous soumettre aux ',
        termsOfPurchase: 'Conditions d’achat',
        termsOfUse: 'conditions d’utilisation de Sephora',
        iAgreeToSephora: 'J’accepte les ',
        termsAndConditions: 'Conditions ',
        termsOfService: 'les conditions de service '
    };

    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            ...common,
            forTheSubscription: ' concernant l’abonnement et j’autorise Sephora à débiter votre méthode de paiement par défaut ou une autre méthode de paiement inscrit au dossier. Votre abonnement est en cours jusqu’à ce qu’il soit annulé. Vous comprenez que vous pouvez annuler à tout moment sur la page de réapprovisionnement automatique de votre compte.',
            byClickingPlaceOrder: 'En cliquant sur le bouton Passer la commande, vous acceptez également ',
            iAgreeToAutoReplenish: 'Vous acceptez les conditions d’utilisation du réapprovisionnement automatique ',
            andConditionsOfUseHaveRead: 'les conditions d’utilisations de Sephora, et j’ai lu '
        };
    } else {
        resources = {
            ...common,
            forTheSubscription: ' concernant l’abonnement et j’autorise Sephora à débiter ma méthode de paiement par défaut ou une autre méthode de paiement de mon dossier. Mon abonnement est en cours jusqu’à ce qu’il soit annulé. Je comprends que je peux annuler à tout moment sur la page de réapprovisionnement automatique de mon compte.',
            byClickingPlaceOrder: 'En cliquant sur le bouton passer une commande, j’accepte également ',
            iAgreeToAutoReplenish: 'J’accepte les modalités du réapprovisionnement automatique ',
            andConditionsOfUseHaveRead: 'les conditions d’utilisations de Sephora, et j’ai lu '
        };
    }

    return resources[label];
}
