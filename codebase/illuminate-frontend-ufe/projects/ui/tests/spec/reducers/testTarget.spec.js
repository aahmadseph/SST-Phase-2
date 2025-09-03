const testTargetReducer = require('reducers/testTarget').default;
const OFFERS_READY_STATES = testTargetReducer.OFFERS_READY_STATES;
const ACTION_TYPES = require('actions/TestTargetActions').default.TYPES;

const initialState = {
    readyState: OFFERS_READY_STATES.INITIAL,
    offers: {},
    timeout: false,
    swaps: {},
    totalTests: 0,
    receivedTests: 0
};

describe('testTarget reducer', () => {
    it('should return the initial state', () => {
        expect(testTargetReducer(undefined, {})).toEqual(initialState);
    });

    describe(`${ACTION_TYPES.SET_OFFERS}`, () => {
        let newVal, newState;

        beforeEach(() => {
            newVal = { target: true };

            newState = testTargetReducer(initialState, {
                type: ACTION_TYPES.SET_OFFERS,
                offers: newVal
            });
        });
        it('should set offers property with incoming value', () => {
            expect(newState.offers).toEqual(newVal);
        });

        it('should increase the currentTest property by one', () => {
            expect(newState.receivedTests).toEqual(initialState.receivedTests + 1);
        });

        it('should set correct readyState', () => {
            expect(newState.readyState).toEqual(OFFERS_READY_STATES.ADOBE_TESTS_RECEIVED);
        });
    });

    describe(`${ACTION_TYPES.CANCEL_OFFERS}`, () => {
        let newVal, newState;

        beforeEach(() => {
            newVal = true;
            newState = testTargetReducer(initialState, {
                type: ACTION_TYPES.CANCEL_OFFERS,
                timeout: newVal
            });
        });

        it('should set timeout property with incoming value', () => {
            expect(newState.timeout).toEqual(newVal);
        });

        it('should set correct readyState', () => {
            expect(newState.readyState).toEqual(OFFERS_READY_STATES.ADOBE_TESTS_RECEIVED);
        });
    });

    describe(`${ACTION_TYPES.SET_TOTAL_TESTS}`, () => {
        it('should set totalTests property with incoming value', () => {
            const newVal = 3;
            const newState = testTargetReducer(initialState, {
                type: ACTION_TYPES.SET_TOTAL_TESTS,
                tests: 3
            });

            expect(newState.totalTests).toEqual(newVal);
        });
    });

    describe(`${ACTION_TYPES.FORCE_RESET}`, () => {
        let newVal, newState;

        beforeEach(() => {
            newVal = { testA: 123 };

            newState = testTargetReducer(initialState, {
                type: ACTION_TYPES.FORCE_RESET,
                offers: newVal
            });
        });
        it('should set offers property with incoming value', () => {
            expect(newState.offers).toEqual(newVal);
        });

        it('should reset totalTests and receivedTests', () => {
            expect(newState.totalTests).toEqual(1);
            expect(newState.receivedTests).toEqual(1);
        });

        it('should set correct readyState', () => {
            expect(newState.readyState).toEqual(OFFERS_READY_STATES.BCC_TESTS_RECEIVED);
        });
    });
});
