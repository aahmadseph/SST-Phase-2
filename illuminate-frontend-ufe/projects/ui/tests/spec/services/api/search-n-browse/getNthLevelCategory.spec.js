/* eslint-disable no-unused-vars */
describe('Search and Browse API', function () {
    const ufeApi = require('services/api/ufeApi').default;
    const snbApi = require('services/api/search-n-browse').default;
    const urlUtils = require('utils/Url').default;
    const { createSpy } = jasmine;
    let makeQueryString;

    beforeEach(function () {
        spyOn(ufeApi, 'makeRequest').and.returnValue({ then: function () {} });
        makeQueryString = spyOn(urlUtils, 'makeQueryString');
        global.ConstructorioTracker = {
            getSessionID: createSpy(),
            getClientID: createSpy()
        };
    });

    describe('getNthLevelCategory', function () {
        let catalogId;
        let options;

        beforeEach(function () {
            catalogId = '1703321';
            options = {
                pageSize: 3,
                sortBy: -1,
                pl: 15,
                ph: 45,
                catalogSeoName: '/shop/makeup'
            };

            Sephora.Util.InflatorComps.services.CatalogService = {
                catalogEngine: 'Endeca',
                isNLPCatalog: () => false
            };
        });

        it('should call makeRequest method', function () {
            snbApi.getNthLevelCategory(options);
            expect(ufeApi.makeRequest).toHaveBeenCalledTimes(1);
        });

        it('should call makeQueryString when options passed as arguments', function () {
            snbApi.getNthLevelCategory(options);
            expect(urlUtils.makeQueryString).toHaveBeenCalledTimes(1);
            expect(ufeApi.makeRequest).toHaveBeenCalledTimes(1);
        });
    });
});
