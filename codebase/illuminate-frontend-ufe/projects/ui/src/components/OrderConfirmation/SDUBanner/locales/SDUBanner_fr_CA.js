export default function getResource(label, vars = []) {
    const resources = {
        welcomeMessage: 'Bienvenue à la livraison le jour même illimitée',
        youSaved: 'Vous avez économisé',
        savingsAmountUS: '6,95 $',
        savingsAmountCA: '9,95 $',
        todaysOrder: 'sur votre commande d’aujourd’hui.'
    };

    return resources[label];
}
