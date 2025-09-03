/* eslint max-len: [2, 200] */
describe('accountClosureCheck', function () {
    const { accountClosureCheck } = require('services/api/profile/accountClosureCheck').default;
    const ufeApi = require('services/api/ufeApi').default;

    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve('no-matter'));
    });

    it('should perform the call', () => {
        const profileId = '123456';
        accountClosureCheck(profileId);
        expect(ufeApi.makeRequest.calls.first().args[0]).toEqual(`/api/users/profiles/${profileId}/accountClosureCheck`);
    });
});
