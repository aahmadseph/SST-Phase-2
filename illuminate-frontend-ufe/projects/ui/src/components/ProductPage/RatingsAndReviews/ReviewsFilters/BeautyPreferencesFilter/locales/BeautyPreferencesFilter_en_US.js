export default function getResource(label, vars = []) {
    const resources = {
        beautyPreferences: 'Your Beauty Preferences',
        modalTitle: 'Beauty Preferences',
        modalBody: 'You haven\'t saved any Beauty Preferences for this category. Use the other filters to find relevant reviews.',
        buttonText: 'Got it'
    };
    return resources[label];
}
