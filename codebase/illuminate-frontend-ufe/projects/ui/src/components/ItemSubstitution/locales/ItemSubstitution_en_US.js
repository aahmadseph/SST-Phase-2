
module.exports = function getResource(label) {
    const resources = {
        outOfStock: 'If out of stock:',
        notSubstitute: 'Do not substitute',
        substituteWith: 'Substitute with...',
        substitutionInfoTitle: 'About Item Substitution',
        substituteOption: 'substitute option'
    };

    return resources[label];
};
