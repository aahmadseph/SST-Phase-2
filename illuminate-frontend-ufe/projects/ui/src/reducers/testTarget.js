const ACTION_TYPES = {
    SET_OFFERS: 'SET_OFFERS',
    RESET_OFFERS: 'RESET_OFFERS',
    CANCEL_OFFERS: 'CANCEL_OFFERS',
    SET_SWAP_COMPONENT: 'SET_SWAP_COMPONENT',
    REGISTER_TEST: 'REGISTER_TEST',
    SET_TOTAL_TESTS: 'SET_TOTAL_TESTS',
    OPEN_BI_PANEL: 'OPEN_BI_PANEL',
    FORCE_RESET: 'FORCE_RESET'
};

const OFFERS_READY_STATES = {
    INITIAL: 0, // initial state,
    BCC_TESTS_RECEIVED: 1, // BCC tests added,
    ADOBE_TESTS_RECEIVED: 2 // adobe tests merged in or adobe call is failed
};

const initialState = {
    readyState: OFFERS_READY_STATES.INITIAL,
    offers: {},
    timeout: false,
    swaps: {},
    totalTests: 0,
    receivedTests: 0
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_OFFERS: {
            return Object.assign({}, state, {
                offers: action.offers,
                receivedTests: Object.keys(action.offers).length,
                readyState: OFFERS_READY_STATES.ADOBE_TESTS_RECEIVED
            });
        }
        case ACTION_TYPES.RESET_OFFERS: {
            return Object.assign({}, state, {
                offers: {},
                readyState: OFFERS_READY_STATES.INITIAL
            });
        }
        case ACTION_TYPES.CANCEL_OFFERS: {
            return Object.assign({}, state, {
                timeout: action.timeout,
                readyState: OFFERS_READY_STATES.ADOBE_TESTS_RECEIVED
            });
        }
        case ACTION_TYPES.SET_SWAP_COMPONENT: {
            const newState = state.swaps[action.testName].slice();
            newState.push(action.component);

            return Object.assign({}, state, { swaps: { [action.testName]: newState } });
        }
        case ACTION_TYPES.REGISTER_TEST: {
            return Object.assign({}, state, { swaps: { [action.testName]: [] } });
        }
        case ACTION_TYPES.SET_TOTAL_TESTS: {
            return Object.assign({}, state, { totalTests: state.totalTests + action.tests });
        }
        case ACTION_TYPES.FORCE_RESET: {
            const totalTests = Object.keys(action.offers || {}).length;
            const newState = Object.assign({}, initialState, {
                offers: action.offers,
                readyState: OFFERS_READY_STATES.BCC_TESTS_RECEIVED,
                totalTests: totalTests,
                receivedTests: totalTests
            });

            return newState;
        }
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;
reducer.OFFERS_READY_STATES = OFFERS_READY_STATES;

export default reducer;
