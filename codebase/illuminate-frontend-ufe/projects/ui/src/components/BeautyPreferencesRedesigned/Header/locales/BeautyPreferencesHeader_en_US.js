
export default function getResource(label, vars = []) {
    const resources = {
        beautyPreferencesTitle: 'Beauty Preferences',
        beautyPreferencesHeaderDescription: 'Tell us your beauty traits and shopping preferences to unlock personalized recommendations.'
    };
    return resources[label];
}
