export default function getResource(label, vars = []) {
    const resources = {
        haveAccount: 'Have a Sephora account?',
        signIn: 'Sign In',
        continueAsGuest: 'Continue as Guest',
        createAccountAfterBooking: 'You’ll have an opportunity to create an account after booking.'
    };

    return resources[label];
}
