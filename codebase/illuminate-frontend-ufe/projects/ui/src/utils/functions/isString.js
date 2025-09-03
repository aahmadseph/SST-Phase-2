function isString(value) {
    return typeof value === 'string';
}

function isNonEmptyString(value) {
    return isString(value) && value.length > 0;
}

export {
    isString, isNonEmptyString
};
