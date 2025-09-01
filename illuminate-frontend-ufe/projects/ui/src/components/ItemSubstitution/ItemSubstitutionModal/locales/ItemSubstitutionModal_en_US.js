const resources = {
    selectSubstitute: 'Select a Substitute',
    selectSubstituteFor: 'Select a substitute for:',
    recommendedSubstitutions: 'Recommended substitutions:',
    cancel: 'Cancel',
    confirm: 'Confirm',
    outOfStock: 'Out of Stock',
    loadLastSubstitute: 'Something went wrong loading the last substitute. Please choose your substitute again.'
};

module.exports = function getResource(label) {
    return resources[label];
};
