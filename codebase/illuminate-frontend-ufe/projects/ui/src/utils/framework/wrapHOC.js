import React from 'react';
import { ArgumentNullException } from 'exceptions';
import { isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import errorBoundary from 'utils/framework/hocs/withErrorBoundary';
import { withRenderTimeMeasurements } from 'utils/framework/hocs/withRenderTimeMeasurements';

const LocalOrQAEnvironment = isUfeEnvQA || isUfeEnvLocal;
const HOCWrappingIsDisabled = Sephora.configurationSettings.core.disableHOCWrapping === true;

/**
 * Compose 3 HOCs (withErrorBoundary, withUserHOC, withRenderTimeMeasurements) into new one.
 * Removes intermidiate ErrorBoundary HOC when it was already applied to the component.
 * In case of exception during composition returns an empty React.Fragment.
 *
 * @param {...Function} arguments The HOCs/functions to compose.
 *
 * @returns {Function} A HOC/function obtained by composing the argument HOCs/functions from right to left.
 */
function compose(withErrorBoundary, withUserHOC, withRenderTimeMeasurementsFn) {
    function composeWithArgs() {
        try {
            const [wrappedComponent, ...hocArguments] = arguments;
            let resultHOC;

            // Remove intermidiate ErrorBoundary HOC if it was already applied to the component.
            if (wrappedComponent.errorBoundary) {
                resultHOC = wrappedComponent.WrappedComponent;
            } else {
                resultHOC = wrappedComponent;
            }

            if (withRenderTimeMeasurementsFn) {
                resultHOC = withRenderTimeMeasurementsFn(resultHOC);
            }

            resultHOC = withUserHOC(resultHOC, ...hocArguments);
            resultHOC = withErrorBoundary(resultHOC);

            return resultHOC;
        } catch (error) {
            // TODO: create a special error component to render different markup on prod and non prod environments.
            return React.Fragment;
        }
    }

    return composeWithArgs;
}

/**
 * Generic HOC's wrapper for any HOC in application.
 * Creates a new HOC by composing `withErrorBoundary`, `withUserHOC` (user provided HOC) and `withRenderTimeMeasurements` HOCs.
 * `withRenderTimeMeasurements` HOC will not be used during SSR and non local or QA environmets.
 *
 * Example of HOC's composition for `SSR`:
 * ```javascript
 * compose(withErrorBoundary, withUserHOC);
 * ```
 *
 * Example of HOC's composition for `local` environment:
 * ```javascript
 * compose(withErrorBoundary, withUserHOC, withRenderTimeMeasurements);
 * ```
 *
 * @param {Function} withUserHOC User provided HOC.
 *
 * @return {Function} A new HOC based on composition of `withErrorBoundary`, `withUserHOC` and `withRenderTimeMeasurements` (optionaly) HOCs.
 */
const wrapHOC = withUserHOC => {
    if (withUserHOC == null) {
        throw new ArgumentNullException('withUserHOC');
    }

    let hoc;

    if (HOCWrappingIsDisabled) {
        hoc = withUserHOC;
    } else {
        const withErrorBoundary = errorBoundary.createHOC(withUserHOC);

        if (LocalOrQAEnvironment) {
            hoc = compose(withErrorBoundary, withUserHOC, withRenderTimeMeasurements);
        } else {
            hoc = compose(withErrorBoundary, withUserHOC);
        }
    }

    return hoc;
};

export default wrapHOC;
