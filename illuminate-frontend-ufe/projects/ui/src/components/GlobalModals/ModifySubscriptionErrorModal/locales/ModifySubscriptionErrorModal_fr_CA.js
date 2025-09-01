export default function getResource(label, vars = []) {
    const resources = {
        modifySubscription: 'Impossible d’apporter des modifications',
        errorMessage: 'Votre commande est en traitement. Vous pouvez apporter des modifications à la prochaine livraison de votre abonnement, après le traitement de votre commande actuelle. Généralement dans quelques heures.',
        done: 'Terminé'
    };

    return resources[label];
}
