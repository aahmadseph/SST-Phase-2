const ufeApi = require('services/api/ufeApi').default;
const reverseLookUpApi = require('services/api/sdn').default;
const Constants = require('utils/framework/Constants');

describe('service reverseLookUp #getBrandsList', function () {
    let makeRequestStub;
    let url;

    beforeEach(() => {
        global.process.env.UFE_ENV = Constants.UFE_ENV_QA;
        url = Sephora.configurationSettings.sdnDomainBaseUrl + '/v1/reverseLookUp/brandsList';
        makeRequestStub = spyOn(ufeApi, 'makeRequest').and.returnValue(
            Promise.resolve({
                responseStatus: 200,
                sdnAccessToken: '1234567',
                expiresIn: 87654
            })
        );
    });

    it('should call makeRequest with the correct url and options', done => {
        reverseLookUpApi.getBrandsList('1234567').then(() => {
            expect(makeRequestStub.calls.all()[1].args).toEqual([
                url,
                {
                    url: url,
                    method: 'GET',
                    headers: { authorization: 'Bearer 1234567' }
                }
            ]);
            done();
        });
    });

    it('should resolved the correct data', done => {
        reverseLookUpApi.getBrandsList('123456').then(data => {
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
        reverseLookUpApi.getBrandsList().catch(err => {
            expect(err.errorCode).toEqual('test');
            done();
        });
    });
});
