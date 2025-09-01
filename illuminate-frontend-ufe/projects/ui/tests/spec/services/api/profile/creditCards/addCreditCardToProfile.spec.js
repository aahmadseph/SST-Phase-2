const ufeApi = require('services/api/ufeApi').default;
const addCreditCardToProfile = require('services/api/profile/creditCards/addCreditCardToProfile').default;

describe('service addCreditCardToProfile', function () {
    let makeRequest;
    let url;
    const model = {
        creditCard: {
            tokenizerUrls: 'test'
        }
    };

    beforeEach(() => {
        url = '/api/users/profiles/creditCard';
        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve(model));
    });

    it('should call makeRequest with the correct url and options', () => {
        addCreditCardToProfile(model);
        expect(makeRequest.calls.first().args).toEqual([
            url,
            {
                method: 'POST',
                body: JSON.stringify(model)
            }
        ]);
    });

    it('should resolve the correct data', done => {
        addCreditCardToProfile(model).then(data => {
            expect(data).toEqual(model);
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        // eslint-disable-next-line prefer-promise-reject-errors
        makeRequest.and.returnValues(Promise.reject({ errorCode: 'test' }));
        addCreditCardToProfile(model).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
