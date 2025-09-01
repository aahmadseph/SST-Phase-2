import ufeApi from 'services/api/ufeApi';
import generateTokens from 'services/api/authentication/generateLithiumSsoToken';

describe('generateLithiumSsoToken', () => {
    describe('when requesting /api/auth/v1/generateToken', () => {
        it('should call generate tokens function with payload', async () => {
            const makeRequestSpy = spyOn(ufeApi, 'makeRequest');
            const generateTokensSpy = spyOn(generateTokens, 'generateTokens');
            const path = '/v1/generateToken';

            const payload = {
                password: 'Test123',
                loginForCheckout: true,
                email: 'john.doe@sephora.com',
                keepSignedIn: false,
                randomNumber: '4d584eb8-5a97-4b86-bf46-ad7d08ec654f',
                token: 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiO'
            };

            const options = {
                method: 'POST',
                body: JSON.stringify({ payload })
            };

            ufeApi.makeRequest(path, options);
            generateTokens.generateTokens(payload);

            expect(makeRequestSpy).toHaveBeenCalledWith(path, options);
            expect(generateTokensSpy).toHaveBeenCalledWith(payload);
        });
    });
});
