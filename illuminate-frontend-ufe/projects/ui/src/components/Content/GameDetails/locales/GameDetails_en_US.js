module.exports = function getResource(label, vars = []) {
    const resources = {
        downloadApp: 'Download App',
        congrats: 'Congrats, you have completed this task!',
        nextLevel: `You are ${vars[0]}. Your next tier is ${vars[1]}.`
    };

    return resources[label];
};
