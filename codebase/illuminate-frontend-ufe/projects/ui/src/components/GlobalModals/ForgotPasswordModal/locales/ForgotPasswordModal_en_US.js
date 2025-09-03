export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Reset Password',
        resetPasswordMessage: 'To have your password reset, enter your email address below. We will then send an email containing a link to reset your password.',
        emailLabel: 'Email Address',
        sendEmailButton: 'Send Email',
        stillHavingTroublesMsg: 'Still having trouble?',
        unableResetPasswordMessage: 'If you’re unable to reset your password, please call Customer Service at',
        sephoraPhoneNumber: '1-877-SEPHORA',
        phoneNumberTTY: '(1-877-737-4672)',
        phoneNumber: '1-888-866-9845',
        forAssistanceMessage: 'Deaf and Hard-of-Hearing/TTY see',
        accessibility: 'Accessibility',
        resetPassword: 'Reset Password',
        confirmationMessage: 'We have sent an email to',
        confirmationMessage2: 'Please check your inbox and click on the link to reset your password.',
        confirmButton: 'OK',
        fallbackErrorMsg: 'If you are unable to reset your password, please call Customer Service for assistance.'
    };

    return resources[label];
}
