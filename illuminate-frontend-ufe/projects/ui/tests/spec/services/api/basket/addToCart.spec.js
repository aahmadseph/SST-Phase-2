describe('addToCart', () => {
    const { addToCart } = require('services/api/basket').default;

    const ufeApi = require('services/api/ufeApi').default;

    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({}));
    });

    it('should perform the call', () => {
        addToCart(
            {
                orderId: '12345678',
                skuList: [
                    {
                        isAcceptTerms: false,
                        qty: 3,
                        skuId: '1234567'
                    }
                ],
                fulfillmentType: null
            },
            false
        );
        expect(ufeApi.makeRequest.calls.first().args[1].headers['x-timestamp']).toBeDefined();
    });
});
