module.exports = function getResource(label, vars = []) {
    const resources = {
        downloadApp: 'Téléchargez l’appli',
        congrats: 'Félicitations, vous avez terminé cette tâche!',
        nextLevel: `Vous êtes membre ${vars[0]}. Le prochain échelon à atteindre est celui de membre ${vars[1]}.`
    };

    return resources[label];
};
