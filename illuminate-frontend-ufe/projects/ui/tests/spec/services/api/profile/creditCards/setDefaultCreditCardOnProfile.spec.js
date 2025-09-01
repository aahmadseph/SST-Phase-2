const ufeApi = require('services/api/ufeApi').default;
const setDefaultCreditCardOnProfile = require('services/api/profile/creditCards/setDefaultCreditCardOnProfile').default;

describe('service setDefaultCreditCardOnProfile', function () {
    let makeRequest;
    let creditCardId;
    let url;

    beforeEach(() => {
        creditCardId = 4111111111111111;
        url = '/api/users/profiles/creditCards/defaultCreditCard';
        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({ data: 'test' }));
    });

    it('should call makeRequest with the correct url and options', () => {
        setDefaultCreditCardOnProfile(creditCardId);
        expect(makeRequest.calls.first().args).toEqual([
            url,
            {
                method: 'PUT',
                body: JSON.stringify({ creditCardId })
            }
        ]);
    });

    it('should resolved the correct data', done => {
        setDefaultCreditCardOnProfile(creditCardId).then(data => {
            expect(data).toEqual({ data: 'test' });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        // eslint-disable-next-line prefer-promise-reject-errors
        makeRequest.and.returnValues(Promise.reject({ errorCode: 'test' }));
        setDefaultCreditCardOnProfile(creditCardId).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
