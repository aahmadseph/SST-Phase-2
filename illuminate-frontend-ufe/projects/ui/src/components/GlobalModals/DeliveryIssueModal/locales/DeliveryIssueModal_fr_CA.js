export default function getResource(label, vars = []) {
    const resources = {
        orderIssue: 'Signaler le problème',
        pleaseSelect: 'Sélectionnez la raison qui s’applique à votre commande :',
        continue: 'Continuer',
        cancel: 'Annuler',
        goToCustomerService: 'Communiquer avec le service à la clientèle',
        weAreHereToHelp: 'Nous sommes là pour vous aider!',
        selectOne: 'Sélectionnez l’une des options suivantes.',
        requestRefund: 'Demander un remboursement',
        pleaseContact: 'Veuillez communiquer avec le service à la clientèle pour demander un remboursement pour cette commande.',
        requestReplacement: 'Demander un remplacement',
        replaceOrder: 'Remplacer la commande',
        weProvideReplacement: 'Nous offrons un remplacement unique pour votre commande, sans frais! La livraison sera la même que votre commande originale. Toutes les demandes de remplacement sont sujettes à vérification.',
        pleaseReachOut: 'Veuillez communiquer avec le service à la clientèle pour obtenir de l’aide avec votre commande.',
        pleaseMakeSelection: 'Veuillez faire un choix.',
        somethingWrong: 'Nous sommes désolés! Un problème est survenu.',
        please: 'Veuillez ',
        contactCustomerService: 'Communiquer avec le service à la clientèle',
        orTryLater: ' ou réessayez plus tard.'
    };

    return resources[label];
}
