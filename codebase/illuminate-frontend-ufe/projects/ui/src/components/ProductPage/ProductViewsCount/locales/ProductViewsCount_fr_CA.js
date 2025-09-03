module.exports = function getResource(label) {
    const resources = {
        popularNow: 'EN VEDETTE MAINTENANT!',
        peopleViewed: 'd’autres personnes ont récemment consulté cet article.'
    };
    return resources[label];
};
