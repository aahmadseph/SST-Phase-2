module.exports = function getResource(label) {
    const resources = {
        popularNow: 'POPULAR NOW!',
        peopleViewed: 'people recently viewed this.'
    };
    return resources[label];
};
