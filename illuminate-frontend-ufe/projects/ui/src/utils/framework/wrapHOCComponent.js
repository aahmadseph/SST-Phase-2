import { ArgumentNullException, ArgumentOutOfRangeException } from 'exceptions';

/**
 * @description Sets component's displayName and additional attributes used by withErrorBoundary HOC
 * and preserves component's creation context (HOC's function arguments).
 *
 * @param {function(*): JSX.Element|null} component Component created within/by the HOC.
 *
 * @param {String} name Component's name.
 *
 * @param {Array} callContext Component creation context (HOC's function arguments).
 *
 * @return {React.Component} Returns the same component that was passed as the first argument to the function.
 */
const wrapHOCComponent = (component, name, callContext) => {
    if (component == null) {
        throw new ArgumentNullException('component');
    } else if (name == null) {
        throw new ArgumentNullException('name');
    } else if (callContext == null) {
        throw new ArgumentNullException('callContext');
    } else if (callContext.length === 0) {
        throw new ArgumentOutOfRangeException('callContext');
    }

    const [WrappedComponent] = callContext;
    component.displayName = `${name}(${WrappedComponent?.displayName || 'WrappedComponent'})`;
    component.componentName = name;
    component.WrappedComponent = WrappedComponent;

    return component;
};

export default wrapHOCComponent;
