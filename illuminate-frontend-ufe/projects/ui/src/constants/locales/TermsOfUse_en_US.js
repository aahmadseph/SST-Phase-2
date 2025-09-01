module.exports = function getResource(label, vars = []) {
    const resources = {
        exclusions: '*With your Sephora Credit card or Sephora Visa. Exclusions apply, ',
        details: 'click here for details.'
    };

    return resources[label];
};
