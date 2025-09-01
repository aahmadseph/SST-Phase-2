describe('Search and Browse API', function () {
    const ufeApi = require('services/api/ufeApi').default;
    const snbApi = require('services/api/search-n-browse').default;

    beforeEach(function () {
        spyOn(ufeApi, 'makeRequest').and.returnValue({ then: function () {} });
    });

    describe('getSkuDetails', function () {
        let skuId;
        beforeEach(function () {
            skuId = '1703321';
        });

        it('should call makeRequest method', function () {
            snbApi.getSkuDetails(skuId);
            expect(ufeApi.makeRequest).toHaveBeenCalledTimes(1);
        });
    });
});
