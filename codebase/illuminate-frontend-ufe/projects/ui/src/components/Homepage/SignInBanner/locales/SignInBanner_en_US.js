const resources = {
    signInFree: 'Sign In for FREE Shipping',
    signInAccount: 'Don’t have an account?',
    signInAccountLink: 'Create an account',
    signInCTA: 'Sign In',
    status: 'You’re a',
    points: 'with',
    join: 'Join Beauty Insider',
    earn: 'to earn points with every purchase.',
    ccRewards: 'Credit Card Rewards'
};

export default function getResource(label) {
    return resources[label];
}
