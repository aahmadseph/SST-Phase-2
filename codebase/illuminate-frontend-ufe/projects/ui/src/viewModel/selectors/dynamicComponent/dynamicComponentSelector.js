import { createSelector } from 'reselect';

// Base selector to get dynamic component state from store
const dynamicComponentStateSelector = (state) => state.dynamicComponents || {};

const dynamicComponentSelector = createSelector(
    dynamicComponentStateSelector,
    (_state, ownProps) => ownProps.sid,
    (dynamicComponentState, sid) => {
        const isDynamicComponentInitializing = dynamicComponentState[sid] &&
            dynamicComponentState[sid].featuresInProgress?.length > 0;

        const dynamicComponent = dynamicComponentState[sid]?.data;

        return {
            isDynamicComponentInitializing,
            dynamicComponent
        };
    }
);

export { dynamicComponentSelector };
