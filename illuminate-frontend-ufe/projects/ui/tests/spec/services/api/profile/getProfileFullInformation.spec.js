import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import RCPSCookies from 'utils/RCPSCookies';
import cookieUtils from 'utils/Cookies';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import getProfileFullInformation from 'services/api/profile/getProfileFullInformation';

describe('getProfileFullInformation', () => {
    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValue(Promise.resolve({}));
        spyOn(urlUtils, 'makeQueryString').and.callThrough();
        spyOn(RCPSCookies, 'isRCPSFullProfileGroup').and.returnValue(false);
        spyOn(Storage.session, 'getItem').and.returnValue('123456');
        spyOn(Storage.local, 'getItem').and.returnValue(null);
    });

    it('should append query parameters to the URL', async () => {
        const profileId = '20324081877';
        const options = {
            skipApis: ['targetersResult', 'basket'],
            propertiesToInclude: ['lithiumSsoToken', 'biAccountId'],
            includeApis: [],
            includeTargeters: false,
            productId: '12345',
            preferedSku: 'abc123',
            refreshSubscriptions: false,
            forceLinkedAccountDetails: false
        };

        await getProfileFullInformation(profileId, options);

        expect(urlUtils.makeQueryString).toHaveBeenCalledWith(options);
    });

    it('should append biAccountId and storeId to the URL if in RCPS full profile group cookie is true', async () => {
        RCPSCookies.isRCPSFullProfileGroup.and.returnValue(true);
        spyOn(cookieUtils, 'read').and.returnValue('123456');
        Sephora.configurationSettings.enablefullProfileGroup = true;
        Storage.local.getItem.and.callFake(key => {
            if (key === LOCAL_STORAGE.USER_DATA) {
                return { profile: { beautyInsiderAccount: { biAccountId: 'bi123' }, preferredStore: 'store456' } };
            } else if (key === LOCAL_STORAGE.PROFILE_ID) {
                return '20324081877';
            } else if (key === LOCAL_STORAGE.AUTH_ACCESS_TOKEN) {
                return 'accessTokenTest';
            }

            return null;
        });

        const profileId = '20324081877';
        const options = {
            skipApis: ['targetersResult', 'basket'],
            propertiesToInclude: ['lithiumSsoToken', 'biAccountId']
        };

        await getProfileFullInformation(profileId, options);

        expect(ufeApi.makeRequest).toHaveBeenCalledWith(
            '/gapi/users/profiles/20324081877/current/full?skipApis=targetersResult&skipApis=basket&propertiesToInclude=lithiumSsoToken&propertiesToInclude=biAccountId&biAccountId=bi123&storeId=store456&preferredZipCode=123456&preferenceStruct=world',
            { method: 'GET' }
        );
    });
});
