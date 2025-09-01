export default function getResource(label, vars = []) {
    const resources = {
        signUpLabel: 'Sign up for Sephora Emails',
        emailPlaceholder: 'Enter your email address',
        signUpSuccessMessage: 'Thanks for signing up for Sephora emails!',
        sameEmailErrorMessage: 'Please enter your email address.',
        button: 'Sign Up'
    };

    return resources[label];
}
