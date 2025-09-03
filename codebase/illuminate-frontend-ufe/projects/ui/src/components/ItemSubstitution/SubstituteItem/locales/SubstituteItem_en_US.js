
module.exports = function getResource(label) {
    const resources = {
        color: 'Color',
        size: 'Size',
        edit: 'Edit',
        doNotSubstitute: 'Do not substitute',
        oufOfStock: 'Out of Stock: ',
        substituteWith: 'Substitute with: ',
        substituteOption: 'Substitute option: '
    };

    return resources[label];
};
