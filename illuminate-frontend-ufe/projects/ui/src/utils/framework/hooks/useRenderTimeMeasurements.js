import { ConnectFunction } from 'constants/reactRedux';
import { useEffect } from 'react';
import Performance from 'utils/framework/performance/Performance';

const ProxyComponent = 'ProxyComponent';

/**
 * @description Custom HOOK to measure component's render time metrics.
 *
 * @param {React.Component} component Component whose performance to measure.
 *
 * @param {Symbol} stackId Key for `Sephora.performance.stack` dictionary.
 */
const useRenderTimeMeasurements = (component, stackId) => {
    const startTime = Performance.now();
    const stack = Sephora.performance.stack.getOrCreateNewStack(stackId);

    let { componentName } = component;

    if (component.isComponent) {
        if (!componentName) {
            componentName = component.displayName;
        }
    } else {
        let isConnectHOC = false;

        if (Sephora.isNodeRender) {
            isConnectHOC = !componentName && component.name === ProxyComponent;
        } else {
            isConnectHOC = !!component.type?.name;
        }

        if (isConnectHOC) {
            componentName = ConnectFunction;
        }
    }

    const context = {
        componentName,
        startTime
    };
    stack.push(context);
    const index = stack.length - 1;

    if (index > 0) {
        const parentContext = stack[index - 1];
        const renderFunctionTime = startTime - parentContext.startTime;
        Sephora.performance.renderTime.increaseHOCsRenderFunctionTime(parentContext.componentName, renderFunctionTime);
    }

    useEffect(() => {
        context.treeRenderTime = Performance.now() - startTime;

        if (component.isComponent) {
            Sephora.performance.renderTime.increaseComponentRenderTime(componentName, context.treeRenderTime);
        } else {
            const childContext = stack[index + 1];

            if (childContext) {
                const renderTime = context.treeRenderTime - childContext.treeRenderTime;
                Sephora.performance.renderTime.increaseHOCsRenderTime(componentName, renderTime);
            } else {
                // HOC has rendered another component instead of `WrappedComponent` when `stackItem === null`.
                // TODO: Neeed to wrap all components with `ErrorBoundary` to enable support of this case.
                // As of now this scenario leads us to case when `context.treeRenderTime` contains not only HOC render time
                // but also includes component render time.
                // JIRRA:
                // We do not count this case untill JIRRA above is resolved!
            }
        }

        if (index === 0) {
            Sephora.performance.stack.deleteById(stackId);
        }
    });
};

export { useRenderTimeMeasurements };
