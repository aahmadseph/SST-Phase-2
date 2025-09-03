const resources = {
    emailSent: 'Email Sent',
    confirmationMessage: 'We have sent an email to',
    confirmationMessage2: 'Please check your inbox and click on the link to reset your password.',
    confirmButton: 'OK',
    didntGetEmail: 'Didn’t get the email? Check your spam folder or',
    resend: 'resend',
    error: 'Error',
    errorMessage: 'Something went wrong, and we could not resend the email. Please try again later.'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
