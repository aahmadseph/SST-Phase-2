const Storage = require('utils/localStorage/Storage').default;
const Flush = require('utils/localStorage/Flush').default;
const LOCAL_STORAGE = require('utils/localStorage/Constants').default;

describe('Storage Flush', () => {
    let removeItemStub;

    beforeEach(() => {
        removeItemStub = spyOn(Storage.local, 'removeItem');
    });

    describe('when flushing the user cache', () => {
        beforeEach(() => {
            Flush.flushUser();
        });

        it('should flush the user data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.USER_DATA);
        });

        it('should flush the credit card realtime prescreen data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.CREDIT_CARD_REALTIME_PRESCREEN);
        });

        it('should flush the credit card dynamic messaging data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.CREDIT_CARD_TARGETERS);
        });
    });

    describe('when flushing the basket', () => {
        beforeEach(() => {
            Flush.flushBasket();
        });

        it('should flush the basket data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.BASKET);
        });
    });

    describe('when flushing the cat nav', () => {
        beforeEach(() => {
            Flush.flushCatNav();
        });

        it('should flush the cat nav data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.CATNAV);
        });

        it('should flush the cat nav locale data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.CAT_NAV_LOCALE);
        });
    });

    describe('when flushing the user additional data', () => {
        beforeEach(() => {
            Flush.flushUserAdditionalData();
        });

        it('should flush the lithium data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.LITHIUM_DATA);
        });

        it('should flush the loves data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.LOVES_DATA);
        });

        it('should flush the created new user data', () => {
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.CREATED_NEW_USER);
        });
    });

    describe('when flushing p13n data', () => {
        let removeAllByStub;

        beforeEach(() => {
            // Mock the removeAllBy method to prevent actual data manipulation
            removeAllByStub = spyOn(Storage.local, 'removeAllBy');
        });

        it('should flush the personalization data', () => {
            // Call the function that triggers the flushing of p13n data
            Flush.flushP13nData();

            // Assert that removeAllByStub was called
            expect(removeAllByStub).toHaveBeenCalled();
        });
    });
});
