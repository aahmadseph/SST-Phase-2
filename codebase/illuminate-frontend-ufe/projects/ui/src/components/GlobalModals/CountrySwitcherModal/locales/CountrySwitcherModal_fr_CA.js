export default function getResource(label, vars = []) {
    const resources = {
        popupSwitchMessage: `Vous êtes sur le point de passer à notre expérience de magasinage ${vars[0]}. `,
        popupSwitchRestrictedItemsMessage: `Si des articles sont soumis à des restrictions au ${vars[0]}, ils seront supprimés de votre panier. `,
        popupSwitchContinueMessage: 'Souhaitez-vous continuer?',
        modalTitle: `Passer à ${vars[0]}`,
        cancelButtonLabel: 'Annuler',
        continueButtonLabel: 'Continuer'
    };
    return resources[label];
}
