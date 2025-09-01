const promiseNames = ['tagManagementSystemReady', 'appMeasurementReady', 'snapChatReady', 'styleHaulReady', 'productDataReady'];

//Simulate the Sephora.analytics object
const objectToPopulate = {
    promises: {},
    resolvePromises: {}
};

const returnedObject = require('analytics/promises').default(objectToPopulate);

const checkForPromises = item => {
    return returnedObject.promises[item] instanceof Promise;
};

const checkForFunctions = item => {
    return returnedObject.resolvePromises[item] instanceof Function;
};

describe('Run the module that sets up promises that can be resolved from anywhere', () => {
    it('creates promises based on a set of names', () => {
        expect(promiseNames.every(checkForPromises)).toBeTruthy();
    });

    it('creates resolve functions based on a set of names', () => {
        expect(promiseNames.every(checkForFunctions)).toBeTruthy();
    });
});
