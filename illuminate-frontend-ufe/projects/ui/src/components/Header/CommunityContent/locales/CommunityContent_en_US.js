export default function getResource(label, vars = []) {
    const resources = {
        signIn: 'Sign In',
        createAccount: 'Create Account',
        joinNow: 'Join Now',
        communityProfile: 'Community Profile',
        signInPrompt: 'Sign in to see your profile',
        joinPrompt: 'Join now to get started',
        yourProfile: 'Your Community Profile',
        notifications: 'Notifications',
        messages: 'Messages'
    };

    return resources[label];
}
