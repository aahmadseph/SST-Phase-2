const ufeApi = require('services/api/ufeApi').default;
const reverseLookUpApi = require('services/api/sdn').default;

describe('service reverseLookUp #getReverseLookUpSkuDetails', function () {
    let makeRequestStub;
    let url;
    let mockSkuId;

    beforeEach(() => {
        mockSkuId = '123456';
        url = skuId => `/api/v3/catalog/skus/${skuId}?countryCode=US&loc=en-US`;
        makeRequestStub = spyOn(ufeApi, 'makeRequest').and.returnValue(Promise.resolve({ data: 'test' }));
    });

    it('should call makeRequest with the correct url and options', () => {
        reverseLookUpApi.getReverseLookUpSkuDetails(mockSkuId);
        expect(makeRequestStub.calls.first().args).toEqual([url(mockSkuId), { method: 'GET' }]);
    });

    it('should resolved the correct data', done => {
        reverseLookUpApi.getReverseLookUpSkuDetails(mockSkuId).then(data => {
            expect(data).toEqual({ data: 'test' });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        makeRequestStub.and.returnValue(Promise.resolve({ errorCode: 'test' }));
        reverseLookUpApi.getReverseLookUpSkuDetails(mockSkuId).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
