const { createSpy } = jasmine;

describe('DefaultStrategy', () => {
    let DefaultStrategy;
    let DefaultStrategyInstance;

    beforeEach(() => {
        DefaultStrategy = require('utils/userLocation/Strategies/DefaultStrategy').default;
        DefaultStrategyInstance = new DefaultStrategy();
    });

    describe('determineLocationAndCall', () => {
        let successStub;
        let failureStub;

        beforeEach(() => {
            successStub = createSpy('successStub');
            failureStub = createSpy('failureStub');
            DefaultStrategyInstance.determineLocationAndCall(successStub, failureStub);
        });

        it('should call success', () => {
            expect(successStub).toHaveBeenCalledTimes(1);
        });

        it('should not call failure', () => {
            expect(failureStub).not.toHaveBeenCalled();
        });
    });
});
