/**
 * @param  {array or string} path - Path to the desired value
 * @param  {obj} start - Optional object with which to start looking up properties on
 * @return {*} - Whatever value is stored in the desired property or ''.
 */
export default function (pathToProperty = [], start = global) {
    let currentLocation = start;

    // eslint-disable-next-line no-param-reassign
    pathToProperty = typeof pathToProperty === 'string' ? pathToProperty.split('.') : pathToProperty;

    for (const currentProp of pathToProperty) {
        const propValue = currentLocation[currentProp];

        if (propValue !== null && typeof propValue !== 'undefined') {
            currentLocation = propValue;
        } else {
            return '';
        }
    }

    return currentLocation;
}
