export default function getResource(label, vars) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            agree: 'Vous acceptez',
            toThe: 'les',
            sephoraSDU: 'Conditions de l’abonnement à la livraison le jour même illimitée de Sephora',
            termsAndConditions: 'Conditions',
            afterTrial:
                `Après votre période d’essai promotionnelle de 30 jours, vous autorisez Sephora à prélever un montant de ${vars[0]} sur votre mode de paiement par défaut ou tout autre mode de paiement associé au compte. Vous comprenez que votre abonnement sera automatiquement renouvelé et que ce montant vous sera facturé annuellement, jusqu’à ce que vous annuliez votre abonnement. Vous reconnaissez que vous pouvez annuler en tout temps à partir de la page Livraison le jour même illimitée, sous Mon compte.`,
            authorize:
                `En passant cette commande, vous autorisez Sephora à prélever un montant de ${vars[0]} sur votre mode de paiement par défaut ou tout autre mode de paiement au compte, et vous comprenez que votre abonnement sera automatiquement renouvelé et que ce montant vous sera facturé annuellement, jusqu’à ce que vous annuliez votre abonnement. Vous reconnaissez que vous pouvez annuler en tout temps à partir de la page Livraison le jour même illimitée, sous Mon compte.`,
            byClicking: 'En cliquant sur le bouton Passer la commande, vous acceptez également',
            termsOfService: 'conditions d’utilisation de Sephora',
            conditionsOfUse: 'et reconnaissez avoir lu les modalités suivantes :',
            privacyPolicy: 'politique de confidentialité',
            title: 'Conditions',
            almostThere: 'Vous y êtes presque! Veuillez lire et accepter les modalités suivantes :',
            placeOrder: 'Passer commande',
            agentConfirmPrefix: 'Je confirme avoir lu le texte du lien de l’abonnement',
            sameDayHyphenated: 'Livraison le jour même illimitée',
            agentConfirmSuffix: 'au client et que j’ai reçu son consentement verbal.',

            sduTrialTitle: 'Livraison le jour même illimitée (essai)',
            sduTrialScriptHeader: 'Veuillez utiliser le texte ci-dessous à titre de référence',
            sduTrialScript: `Vous êtes sur le point de vous inscrire à un essai gratuit de 30 jours pour la livraison le jour même illimitée de Sephora. À moins que vous annuliez cet abonnement avant la fin de la période d’essai, des frais de ${vars[0]} dollars plus taxes vous seront automatiquement facturés pour un abonnement d’un an à la livraison le jour même illimitée de Sephora. Cet abonnement se renouvelle automatiquement tous les 12 mois, à moins que vous ne l’annuliez.\n\nUne fois inscrit(e), vous recevrez un courriel contenant des liens vers les conditions complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\nNous donnez-vous votre consentement pour vous inscrire au programme Livraison le jour même illimité de Sephora, en commençant avec l’essai gratuit de 30 jours? Veuillez répondre « Oui » pour vous inscrire, ou vous pouvez répondre « Non » si vous ne souhaitez pas continuer.\n\n(Une fois que le membre de la clientèle répond par l’affirmative, cochez la case désignée qui confirme que vous lui avez lu les divulgations et que vous l’avez inscrit à la livraison le jour même illimitée)\n\nMerci! Vous êtes maintenant abonné(e) à la livraison le jour même illimitée, commençant avec un essai gratuit de 30 jours. Vous recevrez sous peu un courriel contenant tous les détails sur cet abonnement. Merci d’utiliser nos services et de faire vos achats chez Sephora!`,

            afterSduTrialTitle: 'de l’abonnement à la livraison le jour même illimitée',
            afterSduTrialScriptHeader: 'Veuillez utiliser le texte ci-dessous à titre de référence',
            afterSduTrialScript: `Vous vous inscrivez à la livraison le jour même illimitée de Sephora, et vous devrez payer un montant de ${vars[0]} dollars plus taxes pour un abonnement d’un an qui sera automatiquement renouvelé tous les 12 mois, à moins ou jusqu’à ce que vous l’annuliez.\n\nUne fois inscrit(e), vous recevrez un courriel contenant des liens vers les conditions complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\nNous donnez-vous votre consentement pour vous inscrire à la livraison le jour même illimité de Sephora? Veuillez répondre « Oui » pour vous inscrire, ou vous pouvez répondre « Non » si vous ne souhaitez pas continuer.\n\n(Une fois que le membre de la clientèle répond par l’affirmative, cochez la case désignée qui confirme que vous lui avez lu les divulgations et que vous l’avez inscrit à la livraison le jour même illimitée)\n\nVous êtes désormais inscrit(e) à la livraison le jour même illimitée de Sephora. Vous recevrez sous peu un courriel contenant tous les détails sur cet abonnement. Merci d’utiliser nos services et de faire vos achats chez Sephora!`,
            cancelText: 'Annuler'
        };
    } else {
        resources = {
            agree: 'J’accepte',
            toThe: 'les',
            sephoraSDU: 'Conditions de l’abonnement à la livraison le jour même illimitée de Sephora',
            termsAndConditions: 'Conditions',
            afterTrial:
                    `Après ma période d’essai promotionnelle de 30 jours, j’autorise Sephora à prélever un montant de ${vars[0]} sur mon mode de paiement par défaut ou tout autre mode de paiement au dossier, et je comprends que mon abonnement sera automatiquement renouvelé et que ce montant me sera facturé annuellement, jusqu’à ce que j’annule mon abonnement. Je reconnais que je peux annuler mon abonnement en tout temps à partir de la page Livraison le jour même illimitée, sous Mon compte.`,
            authorize:
                    `En passant cette commande, j’autorise Sephora à prélever un montant de ${vars[0]} sur mon mode de paiement par défaut ou tout autre mode de paiement au dossier, et je comprends que mon abonnement sera automatiquement renouvelé et que ce montant me sera facturé annuellement, jusqu’à ce que j’annule mon abonnement. Je reconnais que je peux annuler mon abonnement en tout temps à partir de la page Livraison le jour même illimitée, sous Mon compte.`,
            byClicking: 'En cliquant sur le bouton Passer la commande, j’accepte également',
            termsOfService: 'les conditions d’utilisation de Sephora',
            conditionsOfUse: 'et je reconnais avoir lu les modalités suivantes :',
            privacyPolicy: 'politique de confidentialité',
            title: 'Conditions',
            almostThere: 'Vous y êtes presque! Veuillez lire et accepter les modalités suivantes :',
            placeOrder: 'Passer commande',
            agentConfirmPrefix: 'Je confirme avoir lu le texte du lien de l’abonnement',
            sameDayHyphenated: 'la livraison le jour même illimitée',
            agentConfirmSuffix: 'au client et que j’ai reçu son consentement verbal.',

            sduTrialTitle: 'Livraison le jour même illimitée (essai)',
            sduTrialScriptHeader: 'Veuillez utiliser le texte ci-dessous à titre de référence',
            sduTrialScript: `Vous êtes sur le point de vous inscrire à un essai gratuit de 30 jours pour la livraison le jour même illimitée de Sephora. À moins que vous annuliez cet abonnement avant la fin de la période d’essai, des frais de ${vars[0]} dollars plus taxes vous seront automatiquement facturés pour un abonnement d’un an à la livraison le jour même illimitée de Sephora. Cet abonnement se renouvelle automatiquement tous les 12 mois, à moins que vous ne l’annuliez.\n\nUne fois inscrit(e), vous recevrez un courriel contenant des liens vers les conditions complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\nNous donnez-vous votre consentement pour vous inscrire au programme Livraison le jour même illimité de Sephora, commençant avec un essai gratuit de 30 jours? Veuillez répondre « Oui » pour vous inscrire, ou répondez « Non » si vous ne souhaitez pas continuer.\n\n(Une fois que le membre de la clientèle répond par l’affirmative, cochez la case désignée qui confirme que vous lui avez lu les divulgations et que vous l’avez inscrit à la livraison le jour même illimitée)\n\nMerci! Vous êtes maintenant abonné(e) à la livraison le jour même illimitée, commençant avec un essai gratuit de 30 jours. Vous recevrez sous peu un courriel contenant tous les détails sur cet abonnement. Merci d’utiliser nos services et de faire vos achats chez Sephora!`,

            afterSduTrialTitle: 'de l’abonnement à la livraison le jour même illimitée',
            afterSduTrialScriptHeader: 'Veuillez utiliser le texte ci-dessous à titre de référence',
            afterSduTrialScript: `Vous vous inscrivez à la livraison le jour même illimitée de Sephora, et vous devrez payer des frais de ${vars[0]} dollars plus taxes pour un abonnement d’un an qui sera automatiquement renouvelé tous les 12 mois, à moins ou jusqu’à ce que vous l’annuliez.\n\nUne fois inscrit(e), vous recevrez un courriel contenant des liens vers les conditions complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\nNous donnez-vous votre consentement pour vous inscrire à la livraison le jour même illimité de Sephora?`,
            cancelText: 'Annuler'
        };
    }

    return resources[label];
}
