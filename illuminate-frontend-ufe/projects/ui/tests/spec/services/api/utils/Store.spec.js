/* eslint max-len: [2, 200] */

describe('Store API Service', function () {
    const ufeApi = require('services/api/ufeApi').default;
    const utilityApi = require('services/api/utility').default;
    let makeRequestSpy;
    beforeEach(function () {
        makeRequestSpy = spyOn(ufeApi, 'makeRequest').and.returnValue({ then: function () {} });
        this.apiUrl = '/api/util/stores';
        this.storeId = '0058';
    });

    describe('Get Store Locations API Service', function () {
        describe('For Particular Store', function () {
            describe('Without params', function () {
                it('should call makeRequest method', function () {
                    utilityApi.storeLocator.getStoreLocations(this.storeId);
                    expect(makeRequestSpy).toHaveBeenCalledTimes(1);
                });
                it('should submit request with url {apiUrl}/{storeId}', function () {
                    utilityApi.storeLocator.getStoreLocations(this.storeId);
                    const requestArgs = makeRequestSpy.calls.argsFor(0);
                    this.apiUrl += '/' + this.storeId;
                    expect(requestArgs[0]).toEqual(this.apiUrl);
                });
            });

            describe('With params', function () {
                it('should submit request with url {apiUrl}/{storeId}? and params zipCode', function () {
                    const optionParams = {};
                    optionParams.zipCode = '94105';
                    utilityApi.storeLocator.getStoreLocations(this.storeId, optionParams);
                    this.apiUrl += '/' + this.storeId + '?zipCode=' + optionParams.zipCode;
                    const requestArgs = makeRequestSpy.calls.argsFor(0);
                    expect(requestArgs[0]).toEqual(this.apiUrl);
                });

                it('should submit request with url {apiUrl}/{storeId}? and ' + 'params zipCode & radius', function () {
                    const optionParams = {};
                    optionParams.zipCode = '94105';
                    optionParams.radius = '100';
                    utilityApi.storeLocator.getStoreLocations(this.storeId, optionParams);
                    const queryParams = [];
                    queryParams.push('zipCode=' + optionParams.zipCode);
                    queryParams.push('radius=' + optionParams.radius);
                    queryParams.push('autoExpand=0');
                    this.apiUrl += '/' + this.storeId + '?' + queryParams.join('&');
                    const requestArgs = makeRequestSpy.calls.argsFor(0);
                    expect(requestArgs[0]).toEqual(this.apiUrl);
                });

                it('should submit request with url {apiUrl}/{storeId}? and ' + 'params latitude & longitude', function () {
                    const optionParams = {};
                    optionParams.latitude = 'somelat';
                    optionParams.longitude = 'somelong';
                    utilityApi.storeLocator.getStoreLocations(this.storeId, optionParams);
                    const queryParams = [];
                    queryParams.push('latitude=' + optionParams.latitude);
                    queryParams.push('longitude=' + optionParams.longitude);
                    this.apiUrl += '/' + this.storeId + '?' + queryParams.join('&');
                    const requestArgs = makeRequestSpy.calls.argsFor(0);
                    expect(requestArgs[0]).toEqual(this.apiUrl);
                });

                it('should submit request with url {apiUrl}/{storeId}? and ' + 'params city, state & country', function () {
                    const optionParams = {};
                    optionParams.city = 'somecity';
                    optionParams.state = 'somestate';
                    optionParams.country = 'somecountry';
                    utilityApi.storeLocator.getStoreLocations(this.storeId, optionParams);
                    const queryParams = [];
                    queryParams.push('city=' + optionParams.city);
                    queryParams.push('state=' + optionParams.state);
                    queryParams.push('country=' + optionParams.country);
                    this.apiUrl += '/' + this.storeId + '?' + queryParams.join('&');
                    const requestArgs = makeRequestSpy.calls.argsFor(0);
                    expect(requestArgs[0]).toEqual(this.apiUrl);
                });

                it('should submit request with url {apiUrl}/{storeId}? and ' + 'params country', function () {
                    const optionParams = {};
                    optionParams.country = 'somecountry';
                    utilityApi.storeLocator.getStoreLocations(this.storeId, optionParams);
                    const queryParams = [];
                    queryParams.push('country=' + optionParams.country);
                    this.apiUrl += '/' + this.storeId + '?' + queryParams.join('&');
                    const requestArgs = makeRequestSpy.calls.argsFor(0);
                    expect(requestArgs[0]).toEqual(this.apiUrl);
                });
            });
        });
    });
});
