/* eslint-disable no-unused-vars */
const { createSpy } = jasmine;

describe('Search and Browse API', function () {
    const { StorageTypes } = require('utils/localStorage/Storage').default;
    const ufeApi = require('services/api/ufeApi').default;
    const snbApi = require('services/api/search-n-browse/searchProductsByKeyword').default;
    const urlUtils = require('utils/Url').default;
    const SEARCH_KEYWORD_URL = '/api/v2/catalog/search/?type=keyword&q=';
    let makeQueryString;
    let url;

    beforeEach(function () {
        spyOn(ufeApi, 'makeRequest').and.returnValue({ then: function () {} });
        makeQueryString = spyOn(urlUtils, 'makeQueryString');
        global.ConstructorioTracker = {
            getSessionID: createSpy(),
            getClientID: createSpy()
        };
    });

    describe('searchProductsByKeyword', function () {
        let options;
        let optionsWithRefinements;
        const config = {
            cache: {
                key: 'test',
                expiry: 300000,
                storageType: StorageTypes.Session
            }
        };
        beforeEach(function () {
            options = {
                catalogId: 'algae',
                config
            };

            optionsWithRefinements = {
                catalogId: 'algae',
                ref: 'filters[Finish]=Natural,filters[Formulation]=Cream',
                config
            };
        });

        it('should call makeRequest method with correct params when Constructor is disabled', function () {
            Sephora.configurationSettings.isNLPSearchEnabled = false;
            Sephora.configurationSettings.isNLPInstrumentationEnabled = true;
            snbApi.searchProductsByKeyword(options);
            expect(ufeApi.makeRequest).toHaveBeenCalledWith(`${SEARCH_KEYWORD_URL}${options.catalogId}`, Object({ method: 'GET' }), config);
        });

        it('should call makeRequest method with correct params when Constructor is enabled', function () {
            Sephora.configurationSettings.isNLPSearchEnabled = true;
            Sephora.configurationSettings.enableConstructorABTest = true;
            Sephora.configurationSettings.isNLPInstrumentationEnabled = true;
            const constructorSessionID = 1;
            const constructorClientID = 9;
            global.ConstructorioTracker.getSessionID.and.returnValue(constructorSessionID);
            global.ConstructorioTracker.getClientID.and.returnValue(constructorClientID);
            url = `${SEARCH_KEYWORD_URL}${options.catalogId}&constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}&targetSearchEngine=nlp`;

            snbApi.searchProductsByKeyword(options);

            expect(ufeApi.makeRequest).toHaveBeenCalledWith(url, Object({ method: 'GET' }), config);
        });

        it('should call makeRequest method with Endeca if Constructor library is not available', function () {
            Sephora.configurationSettings.isNLPSearchEnabled = true;
            Sephora.configurationSettings.isNLPInstrumentationEnabled = true;
            const constructorSessionID = undefined;
            const constructorClientID = undefined;
            global.ConstructorioTracker.getSessionID.and.returnValue(constructorSessionID);
            global.ConstructorioTracker.getClientID.and.returnValue(constructorClientID);
            url = `${SEARCH_KEYWORD_URL}${options.catalogId}`;

            snbApi.searchProductsByKeyword(options);

            expect(ufeApi.makeRequest).toHaveBeenCalledWith(url, Object({ method: 'GET' }), config);
        });

        it('should call makeRequest method with correct params when it has refinements', function () {
            Sephora.configurationSettings.isNLPSearchEnabled = true;
            Sephora.configurationSettings.enableConstructorABTest = true;
            Sephora.configurationSettings.isNLPInstrumentationEnabled = true;
            const constructorSessionID = 1;
            const constructorClientID = 9;
            global.ConstructorioTracker.getSessionID.and.returnValue(constructorSessionID);
            global.ConstructorioTracker.getClientID.and.returnValue(constructorClientID);
            url = `${SEARCH_KEYWORD_URL}${optionsWithRefinements.catalogId}&constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}&targetSearchEngine=nlp`;
            const refinements = '&ref=filters[Finish]=Natural&ref=filters[Formulation]=Cream';

            snbApi.searchProductsByKeyword(optionsWithRefinements);

            expect(ufeApi.makeRequest).toHaveBeenCalledWith(url + refinements, Object({ method: 'GET' }), config);
        });
    });
});
