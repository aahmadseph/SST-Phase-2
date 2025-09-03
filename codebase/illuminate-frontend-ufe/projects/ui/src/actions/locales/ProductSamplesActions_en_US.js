module.exports = function getResource(label) {
    const resources = {
        title: 'Samples Added',
        message: 'Your samples have been added to your basket.',
        ok: 'OK',
        errorTitle: 'Error',
        errorMessage: 'There was a problem loading this page. Please try again later.',
        errorButton: 'Got It'
    };
    return resources[label];
};
