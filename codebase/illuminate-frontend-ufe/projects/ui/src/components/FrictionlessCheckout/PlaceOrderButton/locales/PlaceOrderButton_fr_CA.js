export default function getResource(label, vars = []) {
    const resources = {
        placeOrder: 'Passer commande',
        placeKlarnaOrder: 'Continuer vers Klarna',
        placeAfterpayOrder: 'Continuer vers Afterpay',
        placePazeOrder: 'Continuer vers Paze',
        orderTotal: 'Total de la commande',
        item: 'article',
        items: 'articles',
        authorizeErrorMessage: `Difficulté à se connecter à ${vars[0]}. Veuillez utiliser un autre mode de paiement ou réessayer plus tard.`,
        denialMessage: 'Nous sommes désolés! La méthode de paiement Klarna n’a pas pu être autorisée. Veuillez sélectionner un autre mode de paiement.',
        maxAuthAmountMessage: `{*}Basé sur les articles de premier choix. Votre mode de paiement sera *temporairement autorisé*  pour *${vars[0]}*. {color:blue}+Voir les modalités complètes.+{color}`,
        placeFreePayment: 'Continuer avec',
        withText: 'avec',
        forProcessingText: 'pour',
        placeOrderFor: 'Passer une commande pour ',
        processingOrder: 'Traitement de la commande, veuillez patienter.',
        buttonDisabled: 'Bouton désactivé, remplissez d’abord les champs obligatoires.',
        logoAlt: 'logo'
    };

    return resources[label];
}
