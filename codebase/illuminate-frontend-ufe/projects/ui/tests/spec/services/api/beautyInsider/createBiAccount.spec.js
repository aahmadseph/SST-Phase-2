describe('updateBiAccount', () => {
    const createBiAccount = require('services/api/beautyInsider/createBiAccount').default;
    const ufeApi = require('services/api/ufeApi').default;

    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({}));
    });

    it('should perform the call', () => {
        createBiAccount({
            profileId: '1234567',
            biAccount: { prescreenCustomerResponse: 'userResponse' }
        });
        expect(ufeApi.makeRequest.calls.first().args[1].headers['x-timestamp']).toBeDefined();
    });
});
