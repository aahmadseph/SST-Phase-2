describe('getPreScreenDetails', () => {
    const getPreScreenDetails = require('services/api/profile/getPreScreenDetails').default;
    const ufeApi = require('services/api/ufeApi').default;

    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve('no-matter'));
    });

    it('should perform the call', () => {
        getPreScreenDetails(123456);
        expect(ufeApi.makeRequest.calls.first().args[0]).toEqual('/api/users/profiles/123456/applyCreditCard');
    });
});
