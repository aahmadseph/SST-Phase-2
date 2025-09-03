module.exports = function getResource(label = []) {
    const resources = {
        title: 'Error',
        message: 'Something went wrong while trying to process your submission. Please try again later.',
        button: 'OK'
    };
    return resources[label];
};
