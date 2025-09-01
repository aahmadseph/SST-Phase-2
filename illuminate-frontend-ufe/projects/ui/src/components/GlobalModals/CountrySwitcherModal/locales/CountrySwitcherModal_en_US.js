export default function getResource(label, vars = []) {
    const resources = {
        popupSwitchMessage: `You are about to switch to our ${vars[0]} shopping experience. `,
        popupSwitchRestrictedItemsMessage: `If there are any ${vars[0]}-restricted items, they will be removed from shopping basket. `,
        popupSwitchContinueMessage: 'Do you want to continue?',
        modalTitle: `Switch to ${vars[0]}`,
        cancelButtonLabel: 'Cancel',
        continueButtonLabel: 'Continue'
    };
    return resources[label];
}
