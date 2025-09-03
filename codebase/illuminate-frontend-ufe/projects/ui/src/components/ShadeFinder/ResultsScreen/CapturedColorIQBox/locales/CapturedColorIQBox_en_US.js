export default function getResource(label, vars = []) {
    const resources = {
        saveYourBeauryPrefs: 'Would you like to save this as your current Color IQ shade in your Beauty Preferences?',
        joinToSave: 'Join Beauty Insider to Save',
        signInToSave: 'Sign In to Save',
        save: 'Save',
        tooltipModalTitle: 'Beauty Preferences',
        tooltipModalMessage: 'You can save your Beauty Preferences — such as Color IQ and hair concerns — to your account for a personalized shopping experience.',
        infoModalButton: 'Got It',
        savedPrefsModalTitle: 'Beauty Preferences Saved',
        savedPrefsModalMessage: 'Your preferences have been saved.',
        savedPrefsModalCancelButton: 'Edit Beauty Preferences',
        errorSavingModalTitle: 'Error',
        errorSavingModalMessage: 'Something went wrong and we couldn’t process your request. Please try again later.',
        errorSavingModalButton: 'OK'
    };

    return resources[label];
}
