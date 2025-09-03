
export default function getResource(label, vars = []) {
    const resources = {
        stepOne: '1. Sign In',
        stepTwo: '2. Enter Your Mobile Phone Number',
        noAccount: 'Don’t have an account?',
        createAccount: 'Create an account',
        forgotPassword: 'Forgot password?',
        buttonSignIn: 'Sign In Now & Send Me Text Alerts',
        buttonSendAlerts: 'Send Me Sephora Text Alerts',
        mobileLabel: 'Mobile Phone Number',
        emailAddressLabel: 'Email Address',
        notYouMessage: 'Not you?',
        passwordLabel: 'Password',
        andText: 'and',
        showPasswordLinkAriaLabel: 'Show password text',
        hidePasswordLinkAriaLabel: 'Hide password text',
        enterMobileErrorMessage: 'Please enter a valid mobile phone number.',
        enterPasswordErrorMessage: 'Please enter your password.'
    };

    return resources[label];
}
