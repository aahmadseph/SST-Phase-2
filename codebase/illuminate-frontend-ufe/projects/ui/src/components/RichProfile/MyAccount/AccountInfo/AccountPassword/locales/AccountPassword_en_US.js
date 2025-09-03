export default function getResource(label, vars = []) {
    const resources = {
        password: 'Password',
        edit: 'Edit',
        confirmPasswordLabel: 'Confirm password',
        cancel: 'Cancel',
        update: 'Update',
        errorMessagePassword: 'Please fill out this field.',
        errorShortPassword: `Please enter a password between ${vars[0]}-${vars[1]} characters (no spaces).`,
        errorConfirmPassord: 'The passwords you entered do not match. Please fix to continue.',
        passwordLabel: `Password (${vars[0]} to ${vars[1]} characters)`
    };
    return resources[label];
}
