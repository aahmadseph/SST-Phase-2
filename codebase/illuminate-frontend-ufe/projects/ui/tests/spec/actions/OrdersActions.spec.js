describe('Order Actions', function () {
    const { createSpy } = jasmine;
    const OrdersActions = require('actions/OrdersActions').default;
    const profileApi = require('services/api/profile').default;

    describe('getRecentOrders', function () {
        let getOrderHistoryApiAtub;
        beforeEach(function () {
            getOrderHistoryApiAtub = spyOn(profileApi, 'getOrderHistory');
        });

        it('should call the correct API passing it correct arguments', function () {
            getOrderHistoryApiAtub.and.returnValue(Promise.resolve({}));
            const callback = createSpy();
            OrdersActions.getRecentOrders(1, 2, 3, callback)();
            expect(getOrderHistoryApiAtub).toHaveBeenCalledWith(1, 2, 3);
        });

        it('should trigger callback when underlying API call succeeds', function (done) {
            const pageNumber = 2;
            const numOrders = 1000;
            const dummyOrders = [1, 2, 3];
            getOrderHistoryApiAtub.and.returnValue(
                Promise.resolve({
                    numOrders: numOrders,
                    orders: dummyOrders
                })
            );

            const callback = createSpy();
            OrdersActions.getRecentOrders(1, pageNumber, 3, callback)().then(() => {
                expect(callback).toHaveBeenCalledWith(numOrders, dummyOrders, pageNumber);
                done();
            });
        });
    });
});
