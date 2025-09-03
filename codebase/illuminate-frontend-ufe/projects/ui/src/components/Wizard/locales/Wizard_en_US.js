export default function getResource(label, vars = []) {
    const resources = {
        back: 'Back',
        retake: 'Retake',
        saveAndContinue: 'Save and Continue',
        signInToSave: 'Sign In to Save',
        seeMatchingProducts: 'See Matching Products',
        apiErrorModalTitle: 'Error',
        apiErrorModalMessage: 'Something went wrong and we couldn’t process your request. Please try again later.',
        errorButtonText: 'OK',
        joinBI: 'Join Beauty Insider to Save'
    };

    return resources[label];
}
