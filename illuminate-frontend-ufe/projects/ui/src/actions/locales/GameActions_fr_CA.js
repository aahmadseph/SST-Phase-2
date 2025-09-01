module.exports = function getResource(label = []) {
    const resources = {
        title: 'Erreur',
        message: 'Un problème est survenu lors du traitement de votre soumission. Veuillez réessayer plus tard.',
        button: 'OK'
    };
    return resources[label];
};
