import Events from 'utils/framework/Events';

// stackSetState is intended to help reduce the render overhead of intense state changing components
// by grouping up all the setStates attemps together in a frame of time of defined by <DELAY>
// and resolving them once this time has passed.
function stackSetState(component, resetAfterPageLoads) {
    const DELAY = 200;
    const setState = component.setState;
    const statePool = [];
    let applyStateTimeout = null;

    // reset setState behavior onLastLoadEvent event is triggered.
    if (resetAfterPageLoads) {
        Events.onLastLoadEvent(window, [Events.PostLoad], () => {
            component.setState = setState.bind(component);
        });
    }

    const applySetState = () => {
        // Iterate over the statePool to process each state as if they were called.
        const condensedState = statePool.reduce((currentState, newState) => {
            return typeof newState === 'function'
                ? Object.assign({}, currentState, newState.call(component, currentState, component.props))
                : Object.assign({}, currentState, newState);
        }, component.state);

        setState.call(component, condensedState);
        clearTimeout(applyStateTimeout);
        applyStateTimeout = null;
    };

    return newState => {
        if (!component) {
            return;
        }

        statePool.push(newState);

        if (!applyStateTimeout) {
            applyStateTimeout = setTimeout(applySetState, DELAY);
        }
    };
}

export default stackSetState;
