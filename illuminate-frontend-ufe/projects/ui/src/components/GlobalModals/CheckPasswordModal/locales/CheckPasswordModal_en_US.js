export default function getResource(label) {
    const resources = {
        title: 'Close Account',
        bodyText: 'For security, please re-enter your password.',
        passwordPlaceholder: 'Password',
        errorMessage: 'Please enter your password.',
        showPasswordLinkAriaLabel: 'Show password text',
        hidePasswordLinkAriaLabel: 'Hide password text',
        cancelButton: 'Cancel',
        submitButton: 'Continue'
    };
    return resources[label];
}

