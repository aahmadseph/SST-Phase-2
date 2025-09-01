export default function getResource(label, vars = []) {
    const resources = {
        beautyPreferencesTitle: 'Beauty Preferences',
        beautyPreferencesDesc: 'Tell us your beauty traits and shopping preferences to unlock personalized recommendations.',
        profileCompletionStatusHeading: 'Complete to Unlock Your Personalized Recommendations',
        profileCompleteMessageHeading: 'Thanks for sharing your preferences.',
        checkRecommendationsLinkHeading: 'Check out your product recommendations.',
        profileInterimMessageHeading: 'Keep going! The more you tell us the better the recommendations.',
        save: 'Save',
        saveAndContinue: 'Save and Continue',
        skipThisQues: 'Skip this question',
        signIn: 'Sign In to Save',
        biSignIn: 'Join Beauty Insider to Save',
        confettiModalTitle: 'You’ve Unlocked Your Picks',
        confettiModalMessage: 'Check out your personalized product picks or keep going to complete your Beauty Preferences.',
        confettiModalButton: 'Got It',
        confettiModalMessageComplete: 'Congrats! Your Beauty Preferences are complete.',
        privacySettings: 'Beauty Preferences Privacy Settings',
        apiErrorModalTitle: 'Changes Not Saved',
        apiErrorModalMessage: 'Oops, something went wrong while trying to process your submission. Please try again.',
        buttonText: 'Got It'
    };
    return resources[label];
}
