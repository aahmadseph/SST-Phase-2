const ufeApi = require('services/api/ufeApi').default;
const enrollCampaign = require('services/api/utility/enrollCampaign').default;
const { X_REFERRAL_TTL_TOKEN } = require('components/Campaigns/Referrer/constants');

describe('service enrollCampaign', function () {
    let makeRequest;
    let url;

    const userId = '123456789';
    const referrerCode = 'a075t3';
    const campaignCode = 'fnf2020';
    const referralToken =
        'eyJhbGciOiJIUzUxMiJ9.eyJyZWZlcnJlci5jb2RlIjoiMHg0emM1IiwicmVmZXJyYWwubGluayI6Ii8weDR6YzUvZm5mMjAyMSIsImV4cCI6MTYxNDI5MTM3MCwiaWF0IjoxNjE0Mjg5NTcwLCJjYW1wYWlnbi5jb2RlIjoiRk5GMjAyMSJ9.qGtj_Z6xlXQjYGhStQqQECYF-ox1E2mW4BSEVVUTnUEO_vx_lQTCgx4Pjlt-0u8Ccs55rq2go9eNimLY5_WVLA';

    beforeEach(() => {
        url = '/api/campaign/enroll/';
        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({ data: 'test' }));
    });

    it('should call makeRequest with the correct url and options', () => {
        enrollCampaign(
            {
                userId,
                referrerCode,
                campaignCode
            },
            referralToken
        );
        expect(makeRequest.calls.first().args).toEqual([
            url,
            {
                headers: { [X_REFERRAL_TTL_TOKEN]: referralToken },
                method: 'POST',
                body: JSON.stringify({
                    userId,
                    referrerCode,
                    campaignCode
                })
            }
        ]);
    });

    it('should resolved the correct data', done => {
        enrollCampaign(
            {
                userId,
                referrerCode,
                campaignCode
            },
            referralToken
        ).then(data => {
            expect(data).toEqual({ data: 'test' });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        makeRequest.and.returnValue(Promise.resolve({ errorCode: 'errorCode' }));
        enrollCampaign(
            {
                userId,
                referrerCode,
                campaignCode
            },
            referralToken
        ).catch(err => {
            expect(err.errorCode).toEqual('errorCode');
            done();
        });
    });
});
