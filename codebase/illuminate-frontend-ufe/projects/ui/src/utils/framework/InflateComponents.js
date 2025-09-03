import React from 'react';
import ReactDOM from 'react-dom';
import Framework from 'utils/framework';
import { InPageComps, EventType } from 'constants/events';
import { isUfeEnvQA, isUfeEnvLocal } from 'utils/Env';
import { hydrate as emotionHydrate } from '@emotion/css';
import LazyLoader from 'utils/framework/LazyLoad';
import promises from 'analytics/promises';
import { isPriorityPage } from 'utils/bundlerChunkLoader';

/* eslint-disable valid-jsdoc */
export default (function () {
    let startTime;
    const priorityPage = isPriorityPage();

    // For render time performance logging
    if (isUfeEnvQA || isUfeEnvLocal) {
        Sephora.Util.InflatorComps.totalRenderTime = 0;
        Sephora.Util.InflatorComps.totalInclusiveRenderTime = 0;
        Sephora.Util.InflatorComps.rootRenderTime = 0;
    }

    /**
     * Actually render the component (wraps react)
     * @param component
     * @param props
     * @param element
     * @returns {*}
     */
    Sephora.Util.InflatorComps.render = function (component, props = {}, element, hydrate = true) {
        // Mark root components with red border
        if (process.env.NODE_ENV === 'development' && Sephora.debug.showRootComps) {
            element.style.border = '1px solid red';
        }

        let componentProps = props;

        if (typeof props === 'string') {
            try {
                componentProps = JSON.parse(props);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);

                return null;
            }
        }

        // For render time performance logging
        if (isUfeEnvQA || isUfeEnvLocal) {
            startTime = performance.now();
        }

        const createdReactElement = React.createElement(component, componentProps);

        const render = !hydrate ? ReactDOM.render : ReactDOM.hydrate;
        const renderedElement = render(createdReactElement, element);

        //For render time performance logging
        if (isUfeEnvQA || isUfeEnvLocal) {
            const comp = Sephora.performance.renderTime.getComponentDataByName(component.componentName);

            if (!comp.rootRenderTime) {
                comp.rootRenderTime = 0;
            }

            const renderTime = performance.now() - startTime;
            comp.rootRenderTime += renderTime;

            Sephora.Util.InflatorComps.rootRenderTime += renderTime;
        }

        return renderedElement;
    };

    function requireEnsureCallback() {
        Framework.Application.events.dispatchServiceEvent(InPageComps, EventType.Loaded);
        promises(Sephora.analytics);

        Framework.Application.events.dispatchServiceEvent(InPageComps, EventType.Ready);

        const postDOMContentLoadInitialization = () => {
            if (Sephora.emotionIds && Sephora.emotionIds.length) {
                emotionHydrate(Sephora.emotionIds.split(','));
            }

            Framework.Application.events.dispatchServiceEvent(InPageComps, EventType.ServiceCtrlrsApplied, true);
        };

        if (Sephora.DOMContentLoadedFired) {
            postDOMContentLoadInitialization();
        } else {
            window.addEventListener('DOMContentLoaded', postDOMContentLoadInitialization);
        }

        if (Sephora.isLazyLoadEnabled) {
            LazyLoader.LazyLoaderInstance.start();
        }
    }

    const loadPriorityChunk = () => {
        require.ensure(
            [],
            () => {
                requireEnsureCallback();
            },
            'priority'
        );
    };

    const loadComponentsChunk = () => {
        require.ensure(
            [],
            () => {
                requireEnsureCallback();
            },
            'components'
        );
    };

    // Determine the order of loading based on the priorityPage variable
    priorityPage ? loadPriorityChunk() : loadComponentsChunk();

    return Sephora.Util.InflatorComps;
}());
