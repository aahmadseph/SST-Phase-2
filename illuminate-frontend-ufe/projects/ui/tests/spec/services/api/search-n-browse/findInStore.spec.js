describe('Search and Browse API', function () {
    const ufeApi = require('services/api/ufeApi').default;
    const snbApi = require('services/api/search-n-browse').default;

    beforeEach(function () {
        spyOn(ufeApi, 'makeRequest').and.returnValue({ then: function () {} });
    });

    describe('findInStore', function () {
        let skuId;
        beforeEach(function () {
            skuId = '1703321';
            this.apiUrl = `/api/catalog/skus/${skuId}/search?`;
        });

        it('should call makeRequest method', function () {
            snbApi.findInStore(skuId);
            expect(ufeApi.makeRequest).toHaveBeenCalledTimes(1);
        });

        it('should submit request with params zipCode', function () {
            const optionParams = {};
            optionParams.zipCode = '94105';
            const queryParams = ['zipCode=' + optionParams.zipCode];
            snbApi.findInStore(skuId, optionParams);
            this.apiUrl += queryParams.join('&');
            const requestArgs = ufeApi.makeRequest.calls.argsFor(0)[0];
            expect(requestArgs).toEqual(this.apiUrl);
        });

        it('should submit request with params zipCode & radius', function () {
            const optionParams = {};
            optionParams.zipCode = '94105';
            optionParams.radius = '100';
            const queryParams = [];
            queryParams.push('zipCode=' + optionParams.zipCode);
            queryParams.push('radius=' + optionParams.radius);
            snbApi.findInStore(skuId, optionParams);
            this.apiUrl += queryParams.join('&');
            const requestArgs = ufeApi.makeRequest.calls.argsFor(0)[0];
            expect(requestArgs).toEqual(this.apiUrl);
        });

        it('should submit request with params latitude & longitude', function () {
            const optionParams = {};
            optionParams.latitude = 'somelat';
            optionParams.longitude = 'somelong';
            const queryParams = [];
            queryParams.push('latitude=' + optionParams.latitude);
            queryParams.push('longitude=' + optionParams.longitude);
            snbApi.findInStore(skuId, optionParams);
            this.apiUrl += queryParams.join('&');
            const requestArgs = ufeApi.makeRequest.calls.argsFor(0)[0];
            expect(requestArgs).toEqual(this.apiUrl);
        });
    });
});
