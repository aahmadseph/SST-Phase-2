describe('Service validateAddress', function () {
    let makeRequestStub;
    let url;
    let validateAddress;
    let params;
    let ufeApi;

    beforeEach(() => {
        ufeApi = require('services/api/ufeApi').default;
        validateAddress = require('services/api/utility/validateAddress').default;
        url = '/api/util/address/validate';
        makeRequestStub = spyOn(ufeApi, 'makeRequest').and.returnValue(Promise.resolve({ data: 'test' }));
        params = {
            address1: 'address1',
            city: 'city',
            state: 'state',
            postalCode: 'postaCode',
            country: 'country'
        };
    });

    it('should call makeRequest with the correct url and options', () => {
        validateAddress(params);
        expect(makeRequestStub.calls.first().args).toEqual([
            url,
            {
                method: 'POST',
                body: JSON.stringify(params)
            }
        ]);
    });

    it('should resolved the correct data', done => {
        validateAddress(params).then(data => {
            expect(data).toEqual({ data: 'test' });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        makeRequestStub.and.returnValue(Promise.resolve({ errorCode: 'test' }));
        validateAddress(params).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
