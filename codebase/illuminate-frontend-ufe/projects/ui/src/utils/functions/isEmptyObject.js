function isEmptyObject(value) {
    return value?.constructor === Object && Object.keys(value).length === 0;
}

export default isEmptyObject;
