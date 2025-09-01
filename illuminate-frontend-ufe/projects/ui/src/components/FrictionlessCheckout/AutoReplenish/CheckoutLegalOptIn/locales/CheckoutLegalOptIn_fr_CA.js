export default function getResource(label, vars = []) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            privacyPolicy: 'politique de confidentialité',
            termsOfUse: 'conditions d’utilisation de Sephora',
            termsAndConditions: 'Modalités de l’abonnement de réapprovisionnement automatique de Sephora',
            forTheSubscription: '. En passant cette commande, vous autorisez Sephora à utiliser votre mode de paiement par défaut ou tout autre mode de paiement au compte de façon récurrente, à la fréquence et pour les produits sélectionnés, à moins ou jusqu’à ce que votre abonnement ne soit annulé. Vous comprenez que vous pouvez annuler à tout moment sur la page de réapprovisionnement automatique de Mon compte.',
            byClickingPlaceOrder: 'En cliquant sur le bouton Passer la commande, vous acceptez également ',
            iAgreeToAutoReplenish: 'Vous acceptez les ',
            andConditionsOfUseHaveRead: 'et reconnaissez avoir lu les modalités suivantes : ',
            andText: ' ',
            confirmText: 'Je confirme avoir lu le texte du lien de l’abonnement ',
            autoReplenishSub: 'Abonnement à réapprovisionnement automatique',
            consentText: ' au client et que j’ai reçu son consentement verbal.'
        };
    } else {
        resources = {
            privacyPolicy: 'politique de confidentialité',
            termsOfUse: 'conditions d’utilisation de Sephora',
            termsAndConditions: 'Modalités de l’abonnement de réapprovisionnement automatique de Sephora',
            forTheSubscription: '. En passant cette commande, j’autorise Sephora à utiliser mon mode de paiement par défaut ou un autre mode de paiement du compte de façon récurrente à la fréquence et pour les produits que j’ai sélectionnés, à moins que je n’annule ou jusqu’à ce que j’annule. Je comprends que je peux annuler ceci à tout moment sur la page de réapprovisionnement automatique de Mon compte.',
            byClickingPlaceOrder: 'En cliquant sur le bouton Passer la commande, j’accepte également ',
            iAgreeToAutoReplenish: 'J’accepte les ',
            andConditionsOfUseHaveRead: 'et je reconnais avoir lu les modalités suivantes : ',
            andText: ' '
        };
    }

    return resources[label];
}
