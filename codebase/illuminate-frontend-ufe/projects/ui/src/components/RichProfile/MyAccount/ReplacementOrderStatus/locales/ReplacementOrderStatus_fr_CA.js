export default function getResource(label, vars = []) {
    const resources = {
        orderDetails: 'Détails de la commande',
        orderHistory: 'Afficher l’historique complet des commandes',
        yourOrderNumber: 'Votre numéro de commande est',
        confirmationEmail: 'Vous recevrez un courriel de confirmation au',
        viewOrderDetails: 'Afficher les détails de la commande',
        continueShopping: 'Continuer à magasiner',
        successMessage: 'Une commande de remplacement a été passée.',
        failureMessage: 'Désolé, cette demande a été refusée.',
        failureMessageParagraph1: 'Nous avons examiné votre demande. Votre commande n’est pas admissible à un remplacement. Si vous avez des questions ou si vous avez besoin d’aide supplémentaire, veuillez communiquer avec le service à la clientèle.',
        somethingWrong: 'Oups... Un problème est survenu.',
        somethingWrongMessage: 'Un problème est survenu lors du traitement de votre soumission.',
        tryAgain: 'Réessayer'
    };

    return resources[label];
}
