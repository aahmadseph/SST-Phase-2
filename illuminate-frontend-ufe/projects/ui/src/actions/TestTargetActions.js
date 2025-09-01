import testTargetReducer from 'reducers/testTarget';
const { ACTION_TYPES: TYPES, OFFERS_READY_STATES } = testTargetReducer;

function setOffers(data) {
    // Since __SET__ offers should just set offers into the store
    // but not MERGE it and a previous logic were merging store
    // I injected AB tests at this level
    const offers = Object.assign({}, Sephora.configurationSettings.ABTests || {}, data);

    return {
        type: TYPES.SET_OFFERS,
        offers: offers
    };
}

function forceReset(data) {
    return {
        type: TYPES.FORCE_RESET,
        offers: data
    };
}

function resetOffers(data) {
    return {
        type: TYPES.RESET_OFFERS,
        offers: data
    };
}

function cancelOffers(isCanceled) {
    return {
        type: TYPES.CANCEL_OFFERS,
        timeout: isCanceled
    };
}

function setSwapComponent(component) {
    return {
        type: TYPES.SET_SWAP_COMPONENT,
        testName: component.testName,
        component
    };
}

function registerTest(testName) {
    return {
        type: TYPES.REGISTER_TEST,
        testName
    };
}

function setTotalTests(tests) {
    return {
        type: TYPES.SET_TOTAL_TESTS,
        tests
    };
}

export default {
    TYPES,
    OFFERS_READY_STATES,
    setOffers,
    forceReset,
    resetOffers,
    cancelOffers,
    setSwapComponent,
    registerTest,
    setTotalTests
};
