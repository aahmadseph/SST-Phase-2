module.exports = function getResource (label, vars = []) {
    const resources = {
        signOutInfoModalTitle: 'Confirmation',
        signOutInfoModalMessage: 'The following items will be removed: All non-merchandise except gift cards. Are you sure you want to continue?',
        signOutInfoModalButtonText: 'Continue'
    };
    return resources[label];
};
