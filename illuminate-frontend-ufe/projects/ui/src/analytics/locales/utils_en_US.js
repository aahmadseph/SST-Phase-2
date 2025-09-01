module.exports = function getResource(label) {
    const resources = {
        makeup: 'makeup',
        skincare: 'skincare',
        hair: 'hair',
        fragrance: 'fragrance',
        gifts: 'gifts'
    };

    return resources[label];
};
