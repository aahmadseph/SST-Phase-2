module.exports = function getResource(label, vars = []) {
    const resources = {
        exclusions: '*Avec votre carte de crédit Sephora ou votre carte Visa Sephora. Des exceptions s’appliquent; ',
        details: 'cliquez ici pour plus de détails.'
    };

    return resources[label];
};
