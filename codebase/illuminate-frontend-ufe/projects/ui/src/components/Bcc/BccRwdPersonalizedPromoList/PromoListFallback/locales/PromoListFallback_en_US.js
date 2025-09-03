const resources = {
    signInHeading: 'Get Your Beauty Insider Exclusive Offers',
    signInText: 'Sign in to see if there are any offers waiting for you.',
    signInButton: 'Sign In',
    registerButton: 'Create Account',
    noPromosHeading: 'We’re Working on New Offers For You',
    noPromosText: 'In the meantime, check out our other offers below.'
};

export default function getResource(label) {
    return resources[label];
}
