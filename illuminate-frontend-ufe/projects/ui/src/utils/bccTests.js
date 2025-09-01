const getOnlyValidTests = function (abTests = {}) {
    const validABTests = {};

    for (const prop in abTests) {
        if (Object.prototype.hasOwnProperty.call(abTests, prop)) {
            // We need a try/catch here to check for invalid JSON.
            try {
                validABTests[prop] = JSON.parse(abTests[prop]);
            } catch (e) {
                // Invalid JSON
            }
        }
    }

    return validABTests;
};

const findTestInObject = function (obj = {}, testName) {
    return Object.prototype.hasOwnProperty.call(obj, testName);
};

export default {
    getOnlyValidTests,
    findTestInObject
};
