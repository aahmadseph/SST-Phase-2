
export default function getResource(label, vars = []) {
    const resources = {
        lead: 'Sign up for Sephora text alerts to get the latest updates.',
        stepOne: '1. Sign In',
        stepTwo: '2. Enter Your Mobile Phone Number',
        noAccount: 'Don’t have an account?',
        createAccount: 'Create an Account',
        forgotPassword: 'Forgot password',
        buttonSignIn: 'Sign In & Send Me Text Alerts',
        buttonSendAlerts: 'Send Me Sephora Text Alerts',
        mobileLabel: 'Mobile Phone Number',
        emailAddressLabel: 'Email Address',
        notYouMessage: 'Not you?',
        passwordLabel: 'Password',
        andText: 'and',
        showPasswordLinkAriaLabel: 'Show password text',
        hidePasswordLinkAriaLabel: 'Hide password text',
        enterMobileErrorMessage: 'Please enter a valid mobile phone number.',
        enterPasswordErrorMessage: 'Please enter your password.',
        disclaimerUS: `By entering your phone number, clicking submit, and confirming sign-up, you consent to the [text terms|${vars[0]}] and to receive recurring autodialed marketing texts, including abandoned cart reminders. Message frequency varies. Consent is not a condition of purchase. Message & data rates may apply. See our [Privacy Policy|${vars[1]}].\n\nOpt-in to marketing text messages about Sephora-exclusive brand launches is available to Beauty Insiders only. If you have already opted-in to receive Sephora marketing text messages, you will receive updates about Sephora-exclusive brand launches and no further steps are necessary.`,
        disclaimerCA: `By entering your phone number, clicking submit, and confirming sign-up, you consent to the [text terms|${vars[0]}] and to receive recurring autodialed marketing texts with exclusive offers and product updates, including abandoned cart reminders. Message frequency varies. Message & data rates may apply. See our [Privacy Policy|${vars[1]}]. Text STOP to cancel at any time. HELP for help. Sephora: 600 de Maisonneuve Boulevard West, Suite 2400, Montréal, Quebec, H3A 3J2, Canada. 1-877-737-4672.\n\nOpt-in to marketing text messages about Sephora-exclusive brand launches is available to Beauty Insiders only. If you have already opted-in to receive Sephora marketing text messages, you will receive updates about Sephora-exclusive brand launches and no further steps are necessary.`
    };

    return resources[label];
}
