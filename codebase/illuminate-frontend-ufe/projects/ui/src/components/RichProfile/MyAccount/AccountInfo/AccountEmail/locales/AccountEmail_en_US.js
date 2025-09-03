export default function getResource(label, vars = []) {
    const resources = {
        email: 'Email',
        edit: 'Edit',
        confirmEmailLabel: 'Confirm email',
        cancel: 'Cancel',
        update: 'Update',
        emptyEmailMessage: 'Please fill out this field.',
        invalidConfirmationMessage: 'The email addresses you entered do not match. Please fix to continue.',
        invalidEmailMessage: 'Please enter an e-mail address in the format username@domain.com.',
        invalidEmailError: 'Invalid email address type. Please use a valid email address'
    };
    return resources[label];
}
