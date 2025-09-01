export default function getResource(label, vars) {
    const resources = {
        confirm: 'Je confirme avoir lu l’abonnement pour',
        sephoraSDU: 'la livraison le jour même illimitée',
        and: 'et',
        autoReplenish: 'Réapprovisionnement automatique',
        toClient: 'au client et que j’ai reçu son consentement verbal.',
        sduModalTitle: 'Livraison le jour même illimitée.',
        sduModalBody: 'Veuillez utiliser le script ci-dessous à titre de référence.\n\n' +
            'Vous vous abonnez à la livraison le jour même illimitée et vous devrez payer 49 $ plus taxes pour un abonnement d’un an qui sera automatiquement renouvelé tous les 12 mois, à moins que vous ne l’annuliez.\n\n' +
            'Une fois inscrit(e), vous recevrez un courriel contenant des liens vers les modalités complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\n' +
            'Ai-je votre consentement pour vous inscrire à la livraison le jour même illimitée de Sephora? Veuillez répondre par « oui » pour vous inscrire, ou par « non » si vous ne souhaitez pas continuer.\n\n' +
            '(Une fois que le membre de la clientèle répond par l’affirmative, cochez la case désignée qui confirme que vous lui avez lu les divulgations et que vous l’avez inscrit à la livraison le jour même illimitée)\n\n' +
            'Vous êtes maintenant abonné(e) à la livraison le jour même illimitée. Vous recevrez sous peu un courriel contenant tous les détails sur cet abonnement. Merci d’utiliser nos services et de faire vos achats chez Sephora!',
        autoReplenishModalTitle: 'Abonnement à réapprovisionnement automatique.',
        autoReplenishModalBody: 'Veuillez utiliser le script ci-dessous à titre de référence.\n\n' +
            'Vous vous inscrivez à un abonnement à réapprovisionnement automatique de Sephora.' +
            'Chaque *{INSERT FREQUENCY}* , vous serez facturé *{INSERT PRICE}* dollars plus taxes pour *{INSERT QUANTITY}* unité(s), de *{INSERT ITEM}* sur une base de renouvellement automatique à moins que ou jusqu’à ce que vous l’annuliez.\n\n' +
            'Une fois inscrit(e), vous recevrez un courriel contenant des liens vers les modalités complètes de l’abonnement, ainsi que des instructions pour annuler cet abonnement.\n\n' +
            'Ai-je votre consentement pour vous inscrire au programme de réapprovisionnement automatique de Sephora pour *{INSERT PRODUCT NAME}*? Veuillez répondre par « oui » pour vous inscrire, ou par « non » si vous ne souhaitez pas continuer.\n\n' +
            '(Une fois que le membre de la clientèle répond par l’affirmative, l’agent coche la case désignée pour confirmer qu’il a lu les divulgations au client et qu’il l’a inscrit au réapprovisionnement automatique)\n\n' +
            'Merci pour votre patience! Vous êtes maintenant abonné(e) au réapprovisionnement automatique de Sephora pour *{INSERT PRODUCT NAME}*. Vous recevrez sous peu un courriel expliquant ces détails.'
    };

    return resources[label];
}
