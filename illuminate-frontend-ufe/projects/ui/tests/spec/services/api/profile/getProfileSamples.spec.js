/* eslint max-len: [2, 200] */
describe('getProfileSamples', function () {
    const profileApi = require('services/api/profile/getProfileSamples').default;
    const ufeApi = require('services/api/ufeApi').default;

    beforeEach(function () {
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve('no-matter'));
    });

    describe('main get profile samples api call', () => {
        it('should convert an array of sources to a list string and add to query string params', () => {
            profileApi.getProfileSamples(123456, ['biReward', 'dmg']);
            expect(ufeApi.makeRequest.calls.first().args[0]).toEqual('/api/users/profiles/123456/samples?sampleSources=biReward%2Cdmg');
        });
        it('should append query string params with options if included', () => {
            profileApi.getProfileSamples(123456, ['dmg'], { limit: 16 });
            expect(ufeApi.makeRequest.calls.first().args[0]).toEqual('/api/users/profiles/123456/samples?sampleSources=dmg&limit=16');
        });
    });
});
