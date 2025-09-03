module.exports = function getResource(label) {
    const resources = {
        anErrorOccurredPleaseTryAgainLater: 'An error occurred. Please try again later.',
        error: 'Error',
        ok: 'OK',
        passkeyFromYourAccount: 'passkey from your account.',
        passkeyRemoved: 'Passkey Removed',
        pleaseConfirmYouWantToRemove: 'Please confirm you want to remove',
        removePasskey: 'Remove Passkey',
        removePasskeysTitle: 'Remove Passkey?',
        yourPasskeyHaveBeenRemoved: 'Your passkey has been removed.'
    };
    return resources[label];
};
