import updateProfile from 'services/api/profile/updateProfile';
import ufeApi from 'services/api/ufeApi';
import userUtils from 'utils/User';

describe('updateProfile', function () {
    let profileData;

    beforeEach(function () {
        profileData = {
            fragmentForUpdate: 'PASSWORD',
            password: '123',
            confirmPassword: '456'
        };
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({ profileId: 1 }));
    });

    it('should call legacy profile endpoint when KillSwitch enableAuthServiceUpdatePwd is false', async () => {
        Sephora.configurationSettings.enableAuthServiceUpdatePwd = false;

        await updateProfile(profileData);
        expect(ufeApi.makeRequest).toHaveBeenCalledWith('/api/users/profile', {
            method: 'PUT',
            body: JSON.stringify({
                ...profileData
            }),
            headers: {
                'x-requested-source': 'web',
                'Content-type': 'application/json'
            }
        });
    });

    it('should call SDN v2 endpoint when KillSwitch enableAuthServiceUpdatePwd is true', async () => {
        Sephora.configurationSettings.enableAuthServiceUpdatePwd = true;
        spyOn(userUtils, 'getBiAccountId').and.returnValue('123456789');

        await updateProfile(profileData);
        expect(ufeApi.makeRequest).toHaveBeenCalledWith('/gway/v1/dotcom/auth/v2/users', {
            method: 'PUT',
            body: JSON.stringify({
                clientId: '123456789',
                password: '123'
            }),
            headers: {
                'x-requested-source': 'web',
                'Content-type': 'application/json'
            }
        });
    });
});
