const resources = {
    signInButton: 'Sign In',
    signInText: ' to see your loves list.',
    yourLoves: 'Your loves will appear here.',
    yourSavedItems: 'Your Saved Items'
};

export default function getResource(label) {
    return resources[label];
}
