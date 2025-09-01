/* eslint max-len: 0 */
const { createSpy } = jasmine;

describe('ApplePay service', () => {
    const ApplePay = require('services/ApplePay').default;
    const helperUtils = require('utils/Helpers').default;
    const storage = require('utils/localStorage/Storage').default;
    const { BASKET_TYPES } = require('actions/AddToBasketActions').default;

    describe('getLineItems', () => {
        let orderDetails;
        let lineItems;

        beforeEach(() => {
            orderDetails = {
                'priceInfo.merchandiseSubtotal': '100$',
                'priceInfo.tax': '15$',
                'priceInfo.totalShipping': '10$',
                'priceInfo.promotionDiscount': '7$',
                'priceInfo.storeCardAmount': '25$'
            };
            spyOn(helperUtils, 'getProp').and.callFake((obj, prop) => orderDetails[prop]);
            spyOn(storage.local, 'getItem').and.returnValue(BASKET_TYPES.DC_BASKET);
            lineItems = ApplePay.getLineItems();
        });

        it('should return an array containing a lineItem with the label Merchandise Subtotal', () => {
            expect(lineItems.filter(lineItem => lineItem.label === 'Merchandise Subtotal').length).toEqual(1);
        });

        it('should find a lineItem with the correct amount without currency for Merchandise Subtotal', () => {
            expect(lineItems.find(lineItem => lineItem.label === 'Merchandise Subtotal').amount).toEqual('100.00');
        });

        it('should return an array containing a lineItem with the label Tax', () => {
            expect(lineItems.filter(lineItem => lineItem.label === 'Estimated Tax').length).toEqual(1);
        });

        it('should find a lineItem with the correct amount without currency for Tax amount', () => {
            expect(lineItems.find(lineItem => lineItem.label === 'Estimated Tax').amount).toEqual('15.00');
        });

        it('should return an array containing a lineItem with the label Shipping', () => {
            expect(lineItems.filter(lineItem => lineItem.label === 'Shipping').length).toEqual(1);
        });

        it('should find a lineItem with the correct amount without currency for shipping amount', () => {
            expect(lineItems.find(lineItem => lineItem.label === 'Shipping').amount).toEqual('10.00');
        });

        it('should return an array containing a lineItem with the label Discounts', () => {
            expect(lineItems.filter(lineItem => lineItem.label === 'Discounts').length).toEqual(1);
        });

        it('should find a lineItem with the correct amount without currency for discounts', () => {
            expect(lineItems.find(lineItem => lineItem.label === 'Discounts').amount).toEqual('-7.00');
        });

        it('should return an array containing a lineItem with the label Account Credit', () => {
            expect(lineItems.filter(lineItem => lineItem.label === 'Account Credit').length).toEqual(1);
        });

        it('should find a lineItem with the correct amount without currency for account credit', () => {
            expect(lineItems.find(lineItem => lineItem.label === 'Account Credit').amount).toEqual('-25.00');
        });
    });

    describe('session manipulations', () => {
        let beginStub;
        let abortStub;
        let currentSession;

        beforeEach(() => {
            beginStub = createSpy('begin');
            abortStub = createSpy('abort');
            currentSession = {
                begin: beginStub,
                abort: abortStub
            };
        });

        describe('startSession', () => {
            it('should start session from the scratch', () => {
                ApplePay.startSession(currentSession);
                expect(beginStub).toHaveBeenCalledTimes(1);
            });

            it('should not start session if one is already started', () => {
                ApplePay.startSession(currentSession);
                ApplePay.startSession(currentSession);
                expect(beginStub).toHaveBeenCalledTimes(1);
            });

            it('should start session if another one was aborted', () => {
                ApplePay.startSession(currentSession);
                ApplePay.abortSession(currentSession);
                ApplePay.startSession(currentSession);
                expect(beginStub).toHaveBeenCalledTimes(2);
            });
        });

        describe('abortSession', () => {
            it('should not abort session that has not been started yet', () => {
                ApplePay.abortSession(currentSession);
                expect(abortStub).not.toHaveBeenCalled();
            });

            it('should abort session if one is already started', () => {
                ApplePay.startSession(currentSession);
                ApplePay.abortSession(currentSession);
                expect(abortStub).toHaveBeenCalledTimes(1);
            });

            it('should not abort session if another one was aborted', () => {
                ApplePay.startSession(currentSession);
                ApplePay.abortSession(currentSession);
                ApplePay.abortSession(currentSession);
                expect(abortStub).toHaveBeenCalledTimes(1);
            });
        });
    });
});
