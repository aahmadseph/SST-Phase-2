const resources = {
    title: 'Check Your Email',
    clickVerificationLink1: 'Please click the verification link we sent to your email',
    clickVerificationLink2: 'to set up your account',
    didntGetIt: 'Didn’t get it? Check your spam folders or',
    completeAccountSetup: 'We sent you an email to complete your account setup. Please complete your account setup to set a password.',
    didntGetEmail: 'Didn’t get the email? Check your spam folder or',
    resend: 'resend',
    confirmButton: 'OK',
    emailResent: 'Email successfully resent.',
    emailResentError: 'Something went wrong, and we could not resend the email. Please try again later or resend the email.',
    tokenValidationError: 'The link for verifying your account has expired or is invalid. Please resend the email to get a new link.',
    error: 'Error',
    success: 'Success'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
