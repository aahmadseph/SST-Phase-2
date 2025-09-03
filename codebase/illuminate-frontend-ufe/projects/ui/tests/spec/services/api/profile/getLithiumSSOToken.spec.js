import RCPSCookies from 'utils/RCPSCookies';
import getLithiumSSOToken from 'services/api/profile/getLithiumSSOToken';
import Storage from 'utils/localStorage/Storage';

describe('getLithiumSSOToken', () => {
    const ufeApi = require('services/api/ufeApi').default;
    const profileId = '20518580130';
    const token = '~2VDZwXs0dxd3UQPVW~jfitzI1KRZn2d8lnww6PxIfPAtmE_4GWYY';

    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValue(Promise.resolve({ lithiumSsoToken: token }));
        spyOn(RCPSCookies, 'isRCPSFullProfileGroup');
        spyOn(Storage.local, 'getItem');
    });

    it('should return a lithium SSO token', async () => {
        const result = await getLithiumSSOToken(profileId);
        expect(result).toEqual(token);
    });

    it('should call the correct API endpoint based on the cookieUtils.isRCPSFullProfileGroup() value', async () => {
        RCPSCookies.isRCPSFullProfileGroup.and.returnValue(true);
        Sephora.configurationSettings.enablefullProfileGroup = true;
        await getLithiumSSOToken(profileId);
        expect(ufeApi.makeRequest).toHaveBeenCalledWith(`/gway/v2/user/profile/lithiumSSOToken/${profileId}`, jasmine.any(Object));
    });

    it('should call SDN v2 endpoint with useNGPFlow param when KillSwitch enableNGPLithiumToken is true', async () => {
        Sephora.configurationSettings.enableNGPLithiumToken = true;

        await getLithiumSSOToken(profileId);
        expect(ufeApi.makeRequest).toHaveBeenCalledWith(`/gway/v2/user/profile/lithiumSSOToken/${profileId}?useNGPFlow=true`, jasmine.any(Object));
    });
});
