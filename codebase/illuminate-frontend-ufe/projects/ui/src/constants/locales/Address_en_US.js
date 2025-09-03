module.exports = function getResource(label, vars = []) {
    const resources = {
        unverifiedTitle: 'Please double-check your address',
        unverifiedLegend: 'Your shipping address could not be verified.',
        unverifiedButtonText: 'Edit address',
        recommendedTitle: 'Use recommended address instead?',
        recommendedLegend: 'Please confirm the standardized shipping address below is correct.',
        recommendedButtonText: 'Use recommended address'
    };

    return resources[label];
};
