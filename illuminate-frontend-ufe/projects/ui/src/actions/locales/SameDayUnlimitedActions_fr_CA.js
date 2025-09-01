module.exports = function getResource(label, vars = []) {
    const resources = {
        sephoraSDUTitle: 'Livraison le jour même illimitée de Sephora',
        gotIt: 'Compris',
        cancelSubscription: 'Annuler l’abonnement',
        wellMissYou: 'Vous allez nous manquer!',
        cancelSubscriptionMsg: 'Si vous annulez maintenant, vous pouvez toujours utiliser votre abonnement actif jusqu’au ',
        cancelTrialMsgStart: 'Si vous annulez maintenant, vous perdrez immédiatement vos avantages et devrez payer ',
        cancelTrialMsgEnd: 'pour les commandes avec la livraison le jour même.',
        nevermind: 'Ignorer',
        subscriptionCanceled: 'Votre abonnement a été annulé.',
        ok: 'OK',
        errorMessage: 'Votre commande est en traitement. Vous pouvez apporter des modifications à votre abonnement, après le traitement de votre commande actuelle. Généralement dans quelques heures.',
        errorModalTitle: 'Impossible d’apporter des modifications'
    };
    return resources[label];
};
