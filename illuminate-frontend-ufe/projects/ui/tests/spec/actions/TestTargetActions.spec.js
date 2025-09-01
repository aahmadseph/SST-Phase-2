describe('TestTarget Actions', () => {
    const Actions = require('actions/TestTargetActions').default;
    let result;

    describe('setOffers', () => {
        beforeEach(() => {
            result = Actions.setOffers({ inlineBasket: true });
        });

        it('should send an Action to set offers', () => {
            expect(result.type).toEqual(Actions.TYPES.SET_OFFERS);
            expect(result.offers).toEqual({ inlineBasket: true });
        });
    });

    describe('cancelOffers', () => {
        beforeEach(() => {
            result = Actions.cancelOffers(true);
        });

        it('should send an Action to cancel offers', () => {
            expect(result.type).toEqual(Actions.TYPES.CANCEL_OFFERS);
            expect(result.timeout).toEqual(true);
        });
    });

    describe('setSwapComponent', () => {
        const component = { testName: 'my test name' };

        beforeEach(() => {
            result = Actions.setSwapComponent(component);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SET_SWAP_COMPONENT);
        });

        it('should set the test name', () => {
            expect(result.testName).toEqual(component.testName);
        });

        it('should set the component', () => {
            expect(result.component).toEqual(component);
        });
    });

    describe('registerTest', () => {
        const testName = 'my test name';

        beforeEach(() => {
            result = Actions.registerTest(testName);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.REGISTER_TEST);
        });

        it('should set the test name', () => {
            expect(result.testName).toEqual(testName);
        });
    });

    describe('setTotalTests', () => {
        beforeEach(() => {
            result = Actions.setTotalTests(5);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SET_TOTAL_TESTS);
        });

        it('should set total tests', () => {
            expect(result.tests).toEqual(5);
        });
    });

    describe('forceReset', () => {
        beforeEach(() => {
            result = Actions.forceReset({ testA: 777 });
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.FORCE_RESET);
        });

        it('should set total tests', () => {
            expect(result.offers).toEqual({ testA: 777 });
        });
    });
});
