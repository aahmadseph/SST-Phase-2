const ufeApi = require('services/api/ufeApi').default;
const reverseLookUpApi = require('services/api/sdn').default;

describe('service reverseLookUp #getProductSkuList', function () {
    let makeRequestStub;
    let url;
    let mockProductId;

    beforeEach(() => {
        mockProductId = '123456';
        url = () => Sephora.configurationSettings.sdnDomainBaseUrl + `/v1/reverseLookUp/productSkuList/${mockProductId}`;
        makeRequestStub = spyOn(ufeApi, 'makeRequest').and.returnValue(
            Promise.resolve({
                responseStatus: 200,
                sdnAccessToken: '1234567',
                expiresIn: 87654
            })
        );
    });

    it('should call makeRequest with the correct url and options', done => {
        reverseLookUpApi.getProductSkuList('123456', mockProductId).then(() => {
            expect(makeRequestStub.calls.all()[1].args).toEqual([
                url(),
                {
                    method: 'GET',
                    url: `${Sephora.configurationSettings.sdnDomainBaseUrl}/v1/reverseLookUp/productSkuList/123456`,
                    headers: { authorization: 'Bearer 1234567' }
                }
            ]);
            done();
        });
    });

    it('should resolved the correct data', done => {
        reverseLookUpApi.getProductSkuList('123456', mockProductId).then(data => {
            expect(data).toEqual({
                responseStatus: 200,
                sdnAccessToken: '1234567',
                expiresIn: 87654
            });
            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        makeRequestStub.and.returnValue(Promise.resolve({ errorCode: 'test' }));
        reverseLookUpApi.getProductSkuList(mockProductId).catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
