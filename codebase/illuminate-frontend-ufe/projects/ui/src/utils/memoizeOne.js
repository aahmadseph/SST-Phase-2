/**
 * Simple memoization function with 1 level of history, meaning there's no heap bloating
 *
 * @param {Function} func - a function to be memoized
 * @param {?Function} getMemoizationKey - memoization key getter. identity by default
 * @returns {function(...[*]=): *} a memoized function
 */
const memoizeOne = (func, getMemoizationKey = firstArg => firstArg) => {
    let result;
    let currentMemoizationKey;

    let initiallyCalled = false;

    return (...args) => {
        const nextMemoizationKey = getMemoizationKey(...args);

        if (!initiallyCalled || nextMemoizationKey !== currentMemoizationKey) {
            result = func(...args);
            initiallyCalled = true;
            currentMemoizationKey = nextMemoizationKey;
        }

        return result;
    };
};

export default memoizeOne;
