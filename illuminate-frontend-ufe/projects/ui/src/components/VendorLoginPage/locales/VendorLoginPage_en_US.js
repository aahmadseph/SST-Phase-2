const resources = {
    restockMessage: 'Last step, then you’re in!',
    reorderMessage: 'Unlock exclusive access to reorder your must-haves by text message.*',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    emptyPassword: 'Please enter your password.',
    hidePasswordLabel: 'Hide password text',
    showPasswordLabel: 'Show password text',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don’t have an account?',
    createAccount: 'Create an account',
    signIn: 'Sign In Now',
    disclaimer: '*By signing into your Sephora account, you will remain logged in for the purpose of SMS for a period of six months. You can log out by unsubscribing.',
    privacyPolicy: 'Privacy Policy',
    beautyInsiderTerms: 'Beauty Insider Terms'
};

export default function getResource(label) {
    return resources[label];
}
