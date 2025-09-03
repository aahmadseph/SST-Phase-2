export default function getResource(label, vars = []) {
    const resources = {
        resetPassword: 'Reset Password',
        resetLinkExpired: 'Your reset password link has expired or is invalid. Please try again.',
        pleaseCreateNewPassword: 'Please create a new password (6-12 characters long) to access your account.',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        continue: 'Reset Password',
        stillHavingTrouble: 'Still having trouble?',
        unableToResetPassword: 'If you’re unable to reset your password, please call Customer Service at',
        phoneNumber: '(1-877-737-4672)',
        TTY: 'TTY',
        forAssistance: 'Deaf and Hard-of-Hearing/TTY see',
        accessibility: 'Accessibility',
        confirmError: 'The passwords you entered do not match. Please fix to continue',
        resetSuccessful: 'Reset Successful',
        passwordHasBeenReset: 'Your password has been reset and you will be receiving an email confirmation soon.',
        viewProfile: 'OK',
        skipForNow: 'Skip for Now',
        resetYourPassword: 'Reset Your Password',
        changePassword: 'Change Password',
        continueAnyway: 'Continue Anyway'
    };
    return resources[label];
}
