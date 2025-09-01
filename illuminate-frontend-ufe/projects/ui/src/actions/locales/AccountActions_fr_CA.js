module.exports = function getResource(label) {
    const resources = {
        closeAccount: 'Fermer le compte',
        ok: 'OK'
    };
    return resources[label];
};
