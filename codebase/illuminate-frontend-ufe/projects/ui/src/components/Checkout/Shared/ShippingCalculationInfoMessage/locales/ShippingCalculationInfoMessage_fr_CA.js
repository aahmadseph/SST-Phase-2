export default function getResource(label, vars = []) {
    const resources = {
        updatedShippingCalculations: 'Nous avons mis à jour nos calculs d’expédition pour les rendre plus précis et vous donner de meilleurs renseignements concernant la date d’arrivée de votre colis.',
        gotIt: 'Compris'
    };

    return resources[label];
}
