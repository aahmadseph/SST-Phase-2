const ufeApi = require('services/api/ufeApi').default;
const getOrderDetails = require('services/api/checkout/getOrderDetails').default;

describe('getOrderDetails', () => {
    let makeRequestStub, orderId, guestEmail, url;

    beforeEach(() => {
        makeRequestStub = spyOn(ufeApi, 'makeRequest');
    });

    it('should add guestEmail param if it is passsed', () => {
        orderId = 123;
        guestEmail = 'guest@email.com';
        url = '/api/checkout/orders/123?includeShippingItems=true&includeProfileFlags=true' + '&guestEmail=' + guestEmail;
        makeRequestStub.and.returnValue(Promise.resolve({}));

        getOrderDetails(orderId, guestEmail);
        expect(makeRequestStub.calls.first().args[0]).toEqual(url);
    });

    it('should add isReshipOrder param if it is passsed as true', () => {
        orderId = 123;
        url = '/api/checkout/orders/123?includeShippingItems=true&includeProfileFlags=true&isReshipOrder=true';
        makeRequestStub.and.returnValue(Promise.resolve({}));

        getOrderDetails(orderId, '', true);
        expect(makeRequestStub.calls.first().args[0]).toEqual(url);
    });

    it('should not add guestEmail param if it not passsed', () => {
        orderId = 123;
        url = '/api/checkout/orders/123?includeShippingItems=true&includeProfileFlags=true';
        makeRequestStub.and.returnValue(Promise.resolve({}));

        getOrderDetails(orderId);
        expect(makeRequestStub.calls.first().args[0]).toEqual(url);
    });

    it('should not add guestEmail param if null is passed', () => {
        orderId = 123;
        url = '/api/checkout/orders/123?includeShippingItems=true&includeProfileFlags=true';
        makeRequestStub.and.returnValue(Promise.resolve({}));

        getOrderDetails(orderId, null);
        expect(makeRequestStub.calls.first().args[0]).toEqual(url);
    });

    it('should not add guestEmail param if undefined is passed', () => {
        orderId = 123;
        url = '/api/checkout/orders/123?includeShippingItems=true&includeProfileFlags=true';
        makeRequestStub.and.returnValue(Promise.resolve({}));

        getOrderDetails(orderId, undefined);
        expect(makeRequestStub.calls.first().args[0]).toEqual(url);
    });
});
