const ufeApi = require('services/api/ufeApi').default;
const reverseLookUpApi = require('services/api/sdn').default;
const Constants = require('utils/framework/Constants');

describe('service reverseLookUp #getProductList', function () {
    let makeRequestStub;
    let mockBrandId;

    beforeEach(() => {
        global.process.env.UFE_ENV = Constants.UFE_ENV_QA;

        mockBrandId = '123456';
        makeRequestStub = spyOn(ufeApi, 'makeRequest').and.returnValue(
            Promise.resolve({
                responseStatus: 200,
                sdnAccessToken: '1234567',
                expiresIn: 87654
            })
        );
    });

    it('should call makeRequest with the correct url and options', done => {
        reverseLookUpApi.getProductList('1234567', mockBrandId).then(() => {
            expect(makeRequestStub.calls.first().args[1]).toEqual({
                method: 'POST',
                body: JSON.stringify({ clientName: 'BV' })
            });
            done();
        });
    });

    it('should resolved the correct data', done => {
        reverseLookUpApi.getProductList('1234567', mockBrandId).then(data => {
            expect(data).toEqual({
                responseStatus: 200,
                sdnAccessToken: '1234567',
                expiresIn: 87654
            });
            done();
        });
    });

    it('should call makeRequest with', done => {
        reverseLookUpApi.getProductList('1234567', mockBrandId).then(() => {
            expect(makeRequestStub.calls.all()[1].args[0]).toBe(
                `${Sephora.configurationSettings.sdnDomainBaseUrl}/v1/reverseLookUp/brand/1234567/products`
            );
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        makeRequestStub.and.returnValue(Promise.resolve({ errorCode: 'test' }));
        reverseLookUpApi.getProductList(mockBrandId).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
