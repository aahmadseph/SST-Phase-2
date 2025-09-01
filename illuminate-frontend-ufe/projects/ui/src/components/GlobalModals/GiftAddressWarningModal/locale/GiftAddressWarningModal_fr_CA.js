export default function getResource(label, vars = []) {
    const resources = {
        title: 'Avertissement concernant l’adresse du cadeau',
        buttonText: 'Oui, passer la commande',
        cancelButtonText: 'Non, modifier les adresses',
        warningMessage1: 'Votre carte-cadeau et vos articles seront expédiés à différentes adresses.',
        warningMessage2: `${vars[0]} recevra des courriels de confirmation d'expédition et de livraison, ainsi qu’une copie de votre message-cadeau, pour`,
        both: 'les deux',
        warningMessage3: 'l’expédition de la carte-cadeau et de l’article.',
        warningMessage4: 'Est-ce que c’est exact?'
    };

    return resources[label];
}
