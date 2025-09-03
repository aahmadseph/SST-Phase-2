export default function getResource(label, vars = []) {
    const resources = {
        orderCancelationTitle: 'Annulation de commande',
        cancelationReason: 'Raison de l’annulation :',
        enterReasonHere: 'Indiquez la raison de l’annulation ici',
        reasonTextError: 'Veuillez indiquer la raison de votre annulation.',
        continueShopping: 'Continuer à magasiner',
        title: 'Annulation de commande',
        cancelOrderButton: 'Soumettre et annuler la commande',
        messageFailure: `Nous sommes désolés, nous ne sommes actuellement pas en mesure d’annuler votre commande. [Contactez-nous|${vars[0]}] si vous avez besoin d’aide.`,
        buttonText: 'OK'
    };

    return resources[label];
}
