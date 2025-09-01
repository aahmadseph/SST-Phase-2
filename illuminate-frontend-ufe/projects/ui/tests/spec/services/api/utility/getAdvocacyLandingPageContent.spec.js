const { any } = jasmine;

describe('Service getAdvocacyLandingPageContent', function () {
    let makeRequestStub;
    let url;
    let getAdvocacyLandingPageContent;
    let ufeApi;
    let referrerCode;
    let campaignCode;
    let checksum;

    beforeEach(() => {
        ufeApi = require('services/api/ufeApi').default;
        getAdvocacyLandingPageContent = require('services/api/utility/getAdvocacyLandingPageContent').default;
        url = '/api/campaign/share';
        makeRequestStub = spyOn(ufeApi, 'makeRequest').and.returnValue(
            Promise.resolve({
                headers: { get: () => 'abc' },
                data: 'test'
            })
        );
        referrerCode = 'referrerCode';
        campaignCode = 'campaignCode';
        checksum = 'checksum';
    });

    it('should call makeRequest with the correct url, referrer and campaign codes', () => {
        getAdvocacyLandingPageContent({
            referrerCode,
            campaignCode,
            checksum
        });
        expect(makeRequestStub.calls.first().args).toEqual([`${url}/${referrerCode}/${campaignCode}?`, {}, { returnHeaders: true }]);
    });

    it('should resolved the correct data', done => {
        getAdvocacyLandingPageContent({
            referrerCode,
            campaignCode,
            checksum
        }).then(data => {
            expect(data).toEqual({
                data: 'test',
                referralToken: any(String)
            });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        makeRequestStub.and.returnValue(Promise.resolve({ errorCode: 'errorCode' }));
        getAdvocacyLandingPageContent({
            referrerCode,
            campaignCode,
            checksum
        }).catch(err => {
            expect(err.errorCode).toEqual('errorCode');
            done();
        });
    });

    it('should send the userId if the user is known', () => {
        const userId = 123;
        getAdvocacyLandingPageContent(
            {
                referrerCode,
                campaignCode,
                userId,
                checksum
            },
            false,
            {},
            { returnHeaders: true }
        );
        expect(makeRequestStub.calls.first().args).toEqual([`${url}/${referrerCode}/${campaignCode}?userId=${userId}`, {}, { returnHeaders: true }]);
    });
});
