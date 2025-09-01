const ufeApi = require('services/api/ufeApi').default;
const updateCreditCardOnProfile = require('services/api/profile/creditCards/updateCreditCardOnProfile').default;

describe('service updateCreditCardOnProfile', function () {
    let makeRequest;
    let creditCardInfo;
    let url;

    beforeEach(() => {
        creditCardInfo = { creditCardId: 4111111111111111 };
        url = '/api/users/profiles/creditCard';
        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({ data: 'test' }));
    });

    it('should call makeRequest with the correct url and options', () => {
        updateCreditCardOnProfile(creditCardInfo);
        expect(makeRequest.calls.first().args).toEqual([
            url,
            {
                method: 'PUT',
                body: JSON.stringify(creditCardInfo)
            }
        ]);
    });

    it('should resolved the correct data', done => {
        updateCreditCardOnProfile(creditCardInfo).then(data => {
            expect(data).toEqual({ data: 'test' });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        makeRequest.and.returnValues(Promise.resolve({ errorCode: 'test' }));
        updateCreditCardOnProfile(creditCardInfo).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
