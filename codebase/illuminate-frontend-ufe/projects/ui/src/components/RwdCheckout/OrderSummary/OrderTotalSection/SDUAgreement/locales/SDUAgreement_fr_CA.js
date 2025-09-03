export default function getResource(label, vars) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            agree: 'Vous acceptez les',
            sephoraSDU: 'modalités de l’abonnement à la livraison le jour même illimitée de Sephora',
            termsAndConditions: 'Conditions',
            afterTrial:
                `Après votre essai de 30 jours, vous autorisez Sephora à facturer ${vars[0]} annuellement à votre méthode de paiement par défaut ou une autre méthode de paiement inscrit au dossier. Votre abonnement sera automatiquement renouvelé et se poursuivra jusqu’à son annulation. Vous reconnaissez que vous pouvez annuler en tout temps à partir de la page de la livraison le jour même illimitée de Mon compte.`,
            authorize:
                `Vous autorisez Sephora à facturer ${vars[0]} annuellement à votre méthode de paiement par défaut ou une autre méthode de paiement inscrit au dossier. Votre abonnement sera automatiquement renouvelé et se poursuivra jusqu’à son annulation. Vous reconnaissez que vous pouvez annuler en tout temps à partir de la page de la livraison le jour même illimitée de Mon compte.`,
            byClicking: 'En cliquant sur le bouton Passer la commande, j’accepte également les',
            termsOfService: 'les conditions de service',
            conditionsOfUse: 'et d’utilisation de Sephora, et j’ai lu la',
            privacyPolicy: 'politique de confidentialité'
        };
    } else {
        resources = {
            agree: 'J’accepte les',
            sephoraSDU: 'modalités de l’abonnement à la livraison le jour même illimitée de Sephora',
            termsAndConditions: 'Conditions',
            afterTrial:
                    `Après mon essai de 30 jours, j’autorise Sephora à facturer ${vars[0]} annuellement à ma méthode de paiement par défaut ou une autre méthode de paiement de mon dossier. Mon abonnement sera automatiquement renouvelé et se poursuivra jusqu’à son annulation. Je reconnais que je peux annuler en tout temps à partir de la page de la livraison le jour même illimitée de Mon compte.`,
            authorize:
                    `J’autorise Sephora à facturer ${vars[0]} annuellement à ma méthode de paiement par défaut ou une autre méthode de paiement de mon dossier. Mon abonnement sera automatiquement renouvelé et se poursuivra jusqu’à son annulation. Je reconnais que je peux annuler en tout temps à partir de la page de la livraison le jour même illimitée de Mon compte.`,
            byClicking: 'En cliquant sur le bouton Passer la commande, j’accepte également les',
            termsOfService: 'les conditions de service',
            conditionsOfUse: 'et d’utilisation de Sephora, et j’ai lu la',
            privacyPolicy: 'politique de confidentialité'
        };
    }

    return resources[label];
}
