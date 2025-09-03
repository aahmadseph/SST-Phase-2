/* eslint max-len: [2, 200] */
describe('confirmCloseAccount', function () {
    const { confirmCloseAccount } = require('services/api/profile/confirmCloseAccount').default;
    const ufeApi = require('services/api/ufeApi').default;

    beforeEach(() => {
        spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve('no-matter'));
    });

    it('should perform the call', () => {
        const password = '123456';
        confirmCloseAccount(password);
        expect(ufeApi.makeRequest).toHaveBeenCalledWith('/api/secure/confirmCloseAccount', {
            method: 'POST',
            body: JSON.stringify({
                password: '123456'
            })
        });
    });
});
