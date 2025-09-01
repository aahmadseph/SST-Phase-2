export default function getResource(label, vars = []) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            // Link text for the terms and conditions
            sduTermsLink: 'Conditions de l’abonnement à la livraison le jour même illimitée de Sephora',

            // Trial + Auto-Replenish text
            sduAgreementIntro: 'Vous acceptez les ',
            sduTrialDetailsText: `Après votre période d’essai promotionnelle de 30 jours, vous autorisez Sephora à prélever un montant de ${vars[0]} sur votre mode de paiement par défaut ou tout autre mode de paiement associé au compte. Vous comprenez que votre abonnement sera automatiquement renouvelé et que ce montant vous sera facturé annuellement, jusqu’à ce que vous annuliez votre abonnement. Vous reconnaissez que vous pouvez annuler en tout temps à partir de la page Livraison le jour même illimitée, sous Mon compte.`,

            // Subscription + Auto-Replenish text
            sduSubscriptionDetailsText: 'En passant cette commande, vous autorisez Sephora à utiliser votre mode de paiement par défaut ou tout autre mode de paiement au compte de façon récurrente, à la fréquence et pour les produits sélectionnés, à moins ou jusqu’à ce que votre abonnement ne soit annulé. Vous comprenez que vous pouvez annuler à tout moment sur la page de réapprovisionnement automatique de Mon compte.',

            // Regular text for other UI elements
            byClicking: 'En cliquant sur le bouton Passer la commande, vous acceptez également les',
            termsOfService: 'conditions d’utilisation de Sephora',
            conditionsOfUse: 'et reconnaissez avoir lu la',
            privacyPolicy: 'politique de confidentialité'
        };
    } else {
        resources = {
            // Link text for the terms and conditions
            sduTermsLink: 'Conditions de l’abonnement à la livraison le jour même illimitée de Sephora',

            // Trial + Auto-Replenish text
            sduAgreementIntro: 'J’accepte les ',
            sduTrialDetailsText: `Après ma période d’essai promotionnelle de 30 jours, j’autorise Sephora à prélever un montant de ${vars[0]} sur mon mode de paiement par défaut ou tout autre mode de paiement au dossier, et je comprends que mon abonnement sera automatiquement renouvelé et que ce montant me sera facturé annuellement, jusqu’à ce que j’annule mon abonnement. Je reconnais que je peux annuler mon abonnement en tout temps à partir de la page Livraison le jour même illimitée, sous Mon compte.`,

            // Subscription + Auto-Replenish text
            sduSubscriptionDetailsText: 'En passant cette commande, j’autorise Sephora à prélever un montant de {0} sur mon mode de paiement par défaut ou tout autre mode de paiement au dossier, et je comprends que mon abonnement sera automatiquement renouvelé et que ce montant me sera facturé annuellement, jusqu’à ce que j’annule mon abonnement. Je reconnais que je peux annuler mon abonnement en tout temps à partir de la page Livraison le jour même illimitée, sous Mon compte.',

            // Regular text for other UI elements
            byClicking: 'En cliquant sur le bouton Passer la commande, j’accepte également les',
            termsOfService: 'conditions d’utilisation de Sephora',
            conditionsOfUse: 'et je reconnais avoir lu la',
            privacyPolicy: 'politique de confidentialité'
        };
    }

    return resources[label];
}
