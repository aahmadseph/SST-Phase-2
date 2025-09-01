import React from 'react';
import { ArgumentNullException } from 'exceptions';
import { isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import wrapHOCComponent from 'utils/framework/wrapHOCComponent';
import ErrorBorder from 'utils/framework/hocs/withErrorBoundary/ErrorBorder';
import logError from 'utils/framework/logError';
import { useRenderTimeMeasurements } from 'utils/framework/hooks/useRenderTimeMeasurements';

const LocalOrQAEnvironment = isUfeEnvQA || isUfeEnvLocal;

/**
 * @description Creates new JSX element using provided render function.
 * It invokes original render function within the try/catch block.
 * In case of exception `null` will be returned.
 *
 * @param {Function} render Provider is responsible for rendering original component and returning it JSX representation.
 *
 * @param {String} displayName Component's displayName attribute. It's used for logging purposes only.
 *
 * @return {JSX.Element} Shallow copy of original component's JSX element or `null` in case there was an exception.
 */
const runRenderFunction = (render, displayName = '') => {
    try {
        const element = render();

        if (element) {
            const newElement = {
                ...element,
                props: { ...element.props }
            };

            return newElement;
        } else {
            return null;
        }
    } catch (error) {
        let source;

        try {
            source = displayName.split('(')[0];
        } catch {
            source = 'withErrorBoundary';
        }

        logError(error, { source });

        return null;
    }
};

/**
 * @description The function replaces component's render function with new implementation.
 * We do it only for SSR because react error boundary works only client side.
 *
 * @param {React.Component} component Component which render method should be proxied.
 *
 * @return {React.Component} Component received via function argument but with proxied render behaviour.
 */
const proxyRenderFunction = component => {
    let componentToRender = component;
    const { displayName, prototype, type } = component;
    const isFunctionalHOC = !prototype?.render;
    // Flag to indicate that component was wrapped with HOC created by `connect` function.
    const isConnectHOC = !!type?.name;

    if (isFunctionalHOC) {
        const componentToProxy = isConnectHOC ? type : component;
        componentToProxy.isFunctional = true;
        const componentName = componentToProxy.componentName;

        const ProxyComponent = props => {
            return runRenderFunction(() => componentToProxy(props), displayName);
        };

        componentToRender = ProxyComponent;
        componentToRender.displayName = displayName;
        componentToRender.componentName = componentName;
        componentToRender.WrappedComponent = component.WrappedComponent;
        componentToRender.isFunctional = true;
    } else {
        const originalRender = prototype.render;

        prototype.render = function () {
            return runRenderFunction(() => originalRender.call(this), displayName);
        };
    }

    return componentToRender;
};

/**
 * @description Creates `withErrorBoundary` HOC.
 *
 * @param {Function} withUserHOC User's HOC to wrap with `withErrorBoundary` HOC.
 *
 * @return {Function} New `withErrorBoundary` HOC instance.
 */
const createHOC = withUserHOC => {
    if (withUserHOC == null) {
        throw new ArgumentNullException('withUserHOC');
    }

    /**
     * @description The HOC wraps incoming component with higher-order component `ErrorBorder`.
     * It creates an error boundary for the component and all applied to it HOCs.
     * Only very first HOC (in a chain of HOCs applied to component) can be a `withErrorBoundary` HOC.
     * In case it was already applied we delete it by re-wrapping component with only user defined HOCs.
     *
     * @param {React.Component} WrappedComponent Target component to wrap. It can be a component already wrapped with HOC.
     *
     * @return {React.Component} Сomponent wrapped with ErrorBoundary.
     */
    function withErrorBoundary(WrappedComponent) {
        let ComponentToRender = WrappedComponent;

        if (Sephora.isNodeRender) {
            ComponentToRender = proxyRenderFunction(ComponentToRender);
        }

        const ErrorBoundary = props => {
            let newProps = props;

            if (LocalOrQAEnvironment) {
                const stackId = Symbol();
                useRenderTimeMeasurements(ComponentToRender, stackId);
                newProps = {
                    ...props,
                    stackId
                };
            }

            if (Sephora.isNodeRender) {
                return <ComponentToRender {...newProps} />;
            } else {
                return (
                    <ErrorBorder>
                        <ComponentToRender {...newProps} />
                    </ErrorBorder>
                );
            }
        };

        ErrorBoundary.errorBoundary = true;

        return wrapHOCComponent(ErrorBoundary, 'ErrorBoundary', [ComponentToRender]);
    }

    return withErrorBoundary;
};

export default { createHOC };
