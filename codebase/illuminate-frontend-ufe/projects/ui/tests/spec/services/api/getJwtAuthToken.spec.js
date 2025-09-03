const ufeApi = require('services/api/ufeApi').default;

describe('getJwtAuthToken', () => {
    describe('when requesting /v1/manifest/sign', () => {
        it('should avoid caching the accessToken POST call on client side', () => {
            const makeRequestSpy = spyOn(ufeApi, 'makeRequest');
            const path = '/v1/manifest/sign';
            const payload = {
                profileId: '123456',
                profileStatus: 2,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@jdoe.com'
            };
            const options = {
                method: 'GET',
                body: JSON.stringify({ userData: payload })
            };

            ufeApi.makeRequest(path, options);

            expect(makeRequestSpy).toHaveBeenCalledWith(path, options);
        });
    });
});
