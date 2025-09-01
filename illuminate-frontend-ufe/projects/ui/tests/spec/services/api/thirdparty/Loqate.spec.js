describe('Loqate Service', function () {
    let apiUtil;
    let Loqate;
    let requestStub;
    let fakePromise;

    beforeEach(() => {
        Sephora.configurationSettings = { loqateAddressValidationKeys: { loqateFindRetrieveUFEKey: 'key' } };
        apiUtil = require('utils/Api').default;
        Loqate = require('services/api/thirdparty/Loqate').default;
        fakePromise = {
            then: resolve => {
                resolve({
                    data: 'data',
                    json: () => {}
                });

                return fakePromise;
            },
            catch: () => {
                return () => {};
            }
        };
        requestStub = spyOn(apiUtil, 'request').and.returnValue(fakePromise);
    });

    describe('findAddresses', () => {
        let qsParams;
        let opts;
        let localeUtils;

        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            spyOn(localeUtils, 'getCurrentLanguage').and.returnValue('EN');
            qsParams = {
                Key: 'key',
                Text: 'text',
                Container: 'container',
                Language: 'EN',
                Countries: 'US',
                Limit: 10
            };
            opts = {
                url: 'https://api.addressy.com/Capture/Interactive/Find/v1.00/json3.ws',
                method: 'GET',
                qsParams
            };
        });

        it('should call request with correct args', () => {
            Loqate.findAddresses(qsParams.Text, qsParams.Countries, qsParams.Container);
            expect(requestStub).toHaveBeenCalledWith(opts);
        });
    });

    describe('retrieveAddress', () => {
        let qsParams;
        let opts;

        beforeEach(() => {
            qsParams = {
                Key: 'key',
                Id: 'id'
            };
            opts = {
                url: 'https://api.addressy.com/Capture/Interactive/Retrieve/v1.00/json3.ws',
                method: 'GET',
                qsParams
            };
        });

        it('should call request with correct args', () => {
            Loqate.retrieveAddress(qsParams.Id);
            expect(requestStub).toHaveBeenCalledWith(opts);
        });
    });
});
