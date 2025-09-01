import React from 'react';
import { useRenderTimeMeasurements } from 'utils/framework/hooks/useRenderTimeMeasurements';
import wrapHOCComponent from 'utils/framework/wrapHOCComponent';

/**
 * @description HOC to measure render time metrics of `WrappedComponent`.
 *
 * @param {React.Component} WrappedComponent Component whose performance to measure.
 *
 * @return {React.Component} A new HOC instance.
 */
function withRenderTimeMeasurements(WrappedComponent) {
    const RenderTimeMeasurements = props => {
        useRenderTimeMeasurements(WrappedComponent, props.stackId);

        if (WrappedComponent.isComponent) {
            const { stackId, ...restProps } = props;

            return <WrappedComponent {...restProps} />;
        } else {
            return <WrappedComponent {...props} />;
        }
    };

    return wrapHOCComponent(RenderTimeMeasurements, 'RenderTimeMeasurements', arguments);
}

export { withRenderTimeMeasurements };
