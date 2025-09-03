module.exports = function getResource(label) {
    const resources = {
        makeup: 'maquillage',
        skincare: 'soins pour la peau',
        hair: 'cheveux',
        fragrance: 'parfum',
        gifts: 'cadeaux'
    };

    return resources[label];
};
