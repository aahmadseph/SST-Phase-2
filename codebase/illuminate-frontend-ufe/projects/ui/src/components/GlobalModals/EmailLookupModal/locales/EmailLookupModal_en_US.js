const resources = {
    title: 'Create Account',
    joinBiProgram: 'Join the Beauty Insider loyalty program. Earn points, get *FREE standard shipping*, redeem rewards, and more.',
    joinBookingBiProgram: 'Create a FREE Beauty Insider account to manage your service reservations and event RSVPs.',
    email: 'Email Address',
    confirmButton: 'Continue',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    existingUserError: 'We’re sorry, there is an error with your email and/or password. Remember passwords are 6 to 12 characters (letters or numbers) long. Please try again or click Forgot Password.',
    invalidEmailError: 'Invalid email address type. Please use a valid email address'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
