const ufeApi = require('services/api/ufeApi').default;
const removeCreditCardFromProfile = require('services/api/profile/creditCards/removeCreditCardFromProfile').default;

describe('service removeCreditCardFromProfile', function () {
    let makeRequest;
    let userId;
    let creditCardId;
    let url;

    beforeEach(() => {
        userId = 123456789;
        creditCardId = 4111111111111111;
        url = `/api/users/profiles/${userId}/creditCard/${creditCardId}`;
        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({ data: 'test' }));
    });

    it('should call makeRequest with the correct url and options', () => {
        removeCreditCardFromProfile(userId, creditCardId);
        expect(makeRequest.calls.first().args).toEqual([url, { method: 'DELETE' }]);
    });

    it('should resolved the correct data', done => {
        removeCreditCardFromProfile(userId, creditCardId).then(data => {
            expect(data).toEqual({ data: 'test' });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        // eslint-disable-next-line prefer-promise-reject-errors
        makeRequest.and.returnValues(Promise.reject({ errorCode: 'test' }));
        removeCreditCardFromProfile(userId, creditCardId).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
