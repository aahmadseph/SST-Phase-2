export default function getResource (label, vars = []) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            title: 'Conditions',
            placeOrder: 'Passer commande',
            cancel: 'Annuler',
            text: 'Vous y êtes presque! Veuillez lire et accepter les modalités suivantes :',
            arOnlyTitle: 'Conditions',
            arOnlyText: 'Vous y êtes presque! Veuillez lire et accepter les modalités suivantes :',
            arSubscriptionTitle: 'Abonnement à réapprovisionnement automatique.',
            arSubscriptionHeader: 'Veuillez utiliser le texte ci-dessous à titre de référence',
            arSubscriptionScript: `Vous vous inscrivez au réapprovisionnement automatique de Sephora.\n\nChaque <b>${vars[0]}</b>, <b>${vars[1]}</b> dollars plus taxes vous seront facturés automatiquement pour <b>${vars[2]}</b> unité(s) de <b>${vars[3]}</b>, à moins que et jusqu’à ce que vous annuliez votre abonnement.\n\nUne fois inscrit(e), vous recevrez un courriel contenant des liens vers les conditions complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\nAi-je votre consentement pour vous inscrire au programme de réapprovisionnement automatique de Sephora pour l’article <b>${vars[4]}</b>? Veuillez répondre « Oui » pour vous inscrire, ou vous pouvez répondre « Non » si vous ne souhaitez pas continuer.\n\n(Une fois que le membre de la clientèle répond par l’affirmative, cochez la case désignée qui confirme que vous lui avez lu les divulgations et que vous l’avez inscrit au réapprovisionnement automatique)\n\nMerci pour votre patience. Vous êtes maintenant abonné(e) au réapprovisionnement automatique de Sephora pour l’article suivant : <b>${vars[5]}</b>. Vous recevrez sous peu un courriel expliquant ces détails.`,

            arsduText: 'Je confirme avoir lu le texte du lien de l’abonnement ',
            sduLink: 'la livraison le jour même illimitée',
            and: ' et ',
            arLink: 'Abonnement à réapprovisionnement automatique',
            arsduText2: ' au client et que j’ai reçu son consentement verbal.',

            // sdu
            sduTrialTitle: 'Livraison le jour même illimitée (essai)',
            afterSduTrialTitle: 'de l’abonnement à la livraison le jour même illimitée',
            sduTrialScriptHeader: 'Veuillez utiliser le texte ci-dessous à titre de référence',
            afterSduTrialScriptHeader: 'Veuillez utiliser le texte ci-dessous à titre de référence',
            sduTrialScript: 'Vous êtes sur le point de vous inscrire à un essai gratuit de 30 jours pour la livraison le jour même illimitée de Sephora. À moins que vous annuliez cet abonnement avant la fin de la période d’essai, des frais de cinquante-neuf dollars plus taxes vous seront automatiquement facturés pour un abonnement d’un an à la livraison le jour même illimitée de Sephora. Cet abonnement se renouvelle automatiquement tous les 12 mois, à moins que vous ne l’annuliez.\n\nUne fois inscrit(e), vous recevrez un courriel contenant des liens vers les conditions complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\nNous donnez-vous votre consentement pour vous inscrire au programme Livraison le jour même illimité de Sephora, en commençant avec l’essai gratuit de 30 jours? Veuillez répondre « Oui » pour vous inscrire, ou vous pouvez répondre « Non » si vous ne souhaitez pas continuer.\n\n(Une fois que le membre de la clientèle répond par l’affirmative, cochez la case désignée qui confirme que vous lui avez lu les divulgations et que vous l’avez inscrit à la livraison le jour même illimitée)\n\nMerci! Vous êtes maintenant abonné(e) à la livraison le jour même illimitée, commençant avec un essai gratuit de 30 jours. Vous recevrez sous peu un courriel contenant tous les détails sur cet abonnement. Merci d’utiliser nos services et de faire vos achats chez Sephora!',
            afterSduTrialScript: 'Vous vous inscrivez à la livraison le jour même illimitée de Sephora, et vous devrez payer des frais de cinquante-neuf dollars plus taxes pour un abonnement d’un an qui sera automatiquement renouvelé tous les 12 mois, à moins que et jusqu’à ce que vous l’annuliez.\n\nUne fois inscrit(e), vous recevrez un courriel contenant des liens vers les conditions complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\nNous donnez-vous votre consentement pour vous inscrire au programme Livraison le jour même illimité de Sephora? Veuillez répondre « Oui » pour vous inscrire, ou vous pouvez répondre « Non » si vous ne souhaitez pas continuer.\n\n(Une fois que le membre de la clientèle répond par l’affirmative, cochez la case désignée qui confirme que vous lui avez lu les divulgations et que vous l’avez inscrit à la livraison le jour même illimitée)\n\nVous êtes désormais inscrit(e) à la livraison le jour même illimitée de Sephora. Vous recevrez sous peu un courriel contenant tous les détails sur cet abonnement. Merci d’utiliser nos services et de faire vos achats chez Sephora!'
        };
    } else {
        resources = {
            title: 'Conditions',
            placeOrder: 'Passer commande',
            cancel: 'Annuler',
            text: 'Vous y êtes presque! Veuillez lire et accepter les modalités suivantes :',
            arOnlyTitle: 'Conditions d’abonnement au réapprovisionnement automatique',
            arOnlyText: 'Vous y êtes presque! Veuillez lire et accepter les conditions suivantes pour vos articles en réapprovisionnement automatique :'
        };
    }

    return resources[label];
}
