const ufeApi = require('services/api/ufeApi').default;

describe('getSdnAuthToken', () => {
    describe('when requesting /api/oauth/sdn/accessToken', () => {
        it('should avoid caching the accessToken POST call on client side', () => {
            const makeRequestSpy = spyOn(ufeApi, 'makeRequest');
            const path = '/api/oauth/sdn/accessToken';
            const options = {
                method: 'POST',
                body: JSON.stringify({ clientName: 'OLR' })
            };

            ufeApi.makeRequest(path, options);

            expect(makeRequestSpy).toHaveBeenCalledWith(path, options);
        });
    });
});
