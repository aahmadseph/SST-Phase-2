module.exports = function getResource(label, vars = []) {
    const resources = {
        freeShipping: 'You now qualify for free shipping!',
        rougeFreeShipping: 'As a Rouge, you get FREE FLASH SHIPPING on every order',
        rougeEnrolledForFree: 'Rouge, visit the Flash page to enroll for FREE. This item will be removed from your basket.'
    };

    return resources[label];
};
