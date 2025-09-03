const resources = {
    new: 'new',
    signIn: 'Sign in',
    signInToAdd: ' to add or view your Beauty Preferences.',
    infoModalTitle: 'Beauty Preferences',
    infoModalMessage: 'Shop with personalized filters from your ',
    infoModalMessageEndLink: 'Beauty Preferences',
    gotIt: 'Got It',
    applyFilters: 'Apply filters to set your Beauty Preferences.',
    selectAll: 'Select all',
    deselectAll: 'Deselect all'
};

export default function getResource(label) {
    return resources[label];
}
