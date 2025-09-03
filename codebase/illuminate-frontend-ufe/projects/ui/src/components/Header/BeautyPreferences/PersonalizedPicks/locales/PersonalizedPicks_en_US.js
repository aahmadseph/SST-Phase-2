export default function getResource(label, vars = []) {
    const resources = {
        title: 'Your Personalized Product Picks',
        noRecommendationsMessage: 'Complete your Beauty Preferences for right-for-you recommendations.',
        withRecommendationsMessage: 'We selected these based on your skin and hair concerns. Complete your Beauty Preferences for more specific recommendations.',
        withRecommendationsTwoMessage: 'Based on your Beauty Preferences.'
    };
    return resources[label];
}
