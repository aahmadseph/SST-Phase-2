const { createSpy } = jasmine;

describe('StorageStrategy', () => {
    let StorageStrategy;
    let StorageStrategyInstance;
    let Storage;
    let LOCAL_STORAGE;

    beforeEach(() => {
        StorageStrategy = require('utils/userLocation/Strategies/StorageStrategy').default;
        StorageStrategyInstance = new StorageStrategy();
        Storage = require('utils/localStorage/Storage').default;
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;
    });

    describe('determineLocationAndCall', () => {
        let getItemStub;
        let successStub;
        let failureStub;

        beforeEach(() => {
            getItemStub = spyOn(Storage.local, 'getItem');
            successStub = createSpy('successStub');
            failureStub = createSpy('failureStub');
        });

        it('should call getItem with correct key', () => {
            StorageStrategyInstance.determineLocationAndCall(successStub, failureStub);
            expect(getItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.EXPERIENCE_LOCATION);
        });

        describe('with data in storage', () => {
            beforeEach(() => {
                getItemStub.and.returnValue({ display: 'Display' });
                StorageStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should call success', () => {
                expect(successStub).toHaveBeenCalledWith({ display: 'Display' });
            });

            it('should not call failure', () => {
                expect(failureStub).not.toHaveBeenCalled();
            });
        });

        describe('without data in storage', () => {
            beforeEach(() => {
                getItemStub.and.returnValue(null);
                StorageStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalled();
            });

            it('should call failure', () => {
                expect(failureStub).toHaveBeenCalled();
            });
        });
    });
});
