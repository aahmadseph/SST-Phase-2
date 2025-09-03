describe('validate promo', () => {
    const validatePromo = require('services/api/targetedLandingPage/validatePromo').default;
    const ufeApi = require('services/api/ufeApi').default;

    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({}));
    });

    it('should perform the call', () => {
        validatePromo('tokenid', { customerId: '123', promoId: 'testpromo' });
        expect(ufeApi.makeRequest).toHaveBeenCalledTimes(1);
    });
});
