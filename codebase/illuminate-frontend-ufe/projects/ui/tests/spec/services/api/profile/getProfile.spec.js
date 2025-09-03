import NGPCookies from 'utils/NGPCookies';

describe('getProfile', function () {
    const profileApi = require('services/api/profile/getProfile').default;
    const ufeApi = require('services/api/ufeApi').default;
    let email;

    beforeEach(function () {
        email = 'email@address.com';
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({ profileId: 1 }));
        spyOn(NGPCookies, 'isNGPUserRegistrationEnabled');
    });

    describe('getProfileForPasswordReset api call', () => {
        it('should reach endpoint using PUT method and correct Request Payload', async () => {
            await profileApi.getProfileForPasswordReset(email);
            expect(ufeApi.makeRequest).toHaveBeenCalledWith('/api/users/profiles', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    source: 'resetPassword'
                })
            });
        });

        it('should reach lookup endpoint using PUT method and correct Request Payload', async () => {
            NGPCookies.isNGPUserRegistrationEnabled.and.returnValue(true);

            await profileApi.getProfileForPasswordReset(email);
            expect(ufeApi.makeRequest).toHaveBeenCalledWith('/gway/v1/dotcom/auth/v1/user/lookup', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    source: 'resetPassword'
                })
            });
        });
    });

    describe('lookupProfileByLogin api call', () => {
        it('should reach endpoint using PUT method and correct Request Payload', async () => {
            await profileApi.lookupProfileByLogin(email);
            expect(ufeApi.makeRequest).toHaveBeenCalledWith('/api/users/profiles', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    source: 'lookup'
                })
            });
        });
    });
});
