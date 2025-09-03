function reject(array, predicate) {
    if (!Array.isArray(array)) {
        throw new Error(`reject was called with ${array} instead of []`);
    }

    if (typeof predicate !== 'function') {
        throw new Error(`reject was called with ${predicate} instead of function`);
    }

    return array.filter(item => !predicate(item));
}

export default reject;
