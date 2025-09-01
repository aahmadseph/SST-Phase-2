const { createSpy } = jasmine;

describe('Search and Browse API', () => {
    let ufeApi;
    let snbApi;
    let localeUtils;
    let SEARCH_TYPE_AHEAD_URL;
    let query;
    let url;
    let locale;

    beforeEach(() => {
        const userUtils = require('utils/User').default;
        spyOn(userUtils, 'getZipCode').and.returnValue('94301');
        ufeApi = require('services/api/ufeApi').default;
        snbApi = require('services/api/search-n-browse').default;
        localeUtils = require('utils/LanguageLocale').default;
        SEARCH_TYPE_AHEAD_URL = '/api/v2/catalog/search/?type=typeAhead&q=';
        spyOn(ufeApi, 'makeRequest').and.returnValue({ then: () => {} });
        global.ConstructorioTracker = {
            getSessionID: createSpy(),
            getClientID: createSpy()
        };
        locale = `${localeUtils.getCurrentLanguage().toLowerCase()}-${localeUtils.getCurrentCountry()}`;
    });

    describe('searchTypeAhead with Constructor enabled', () => {
        beforeEach(() => {
            query = 'red';
            Sephora.configurationSettings.isNLPSearchEnabled = true;
            Sephora.configurationSettings.isNLPInstrumentationEnabled = true;
            Sephora.channel = 'rwd';
        });

        it('should call makeRequest method with the Constructor params', () => {
            Sephora.configurationSettings.enableConstructorABTest = true;
            const constructorSessionID = 1;
            const constructorClientID = 9;
            global.ConstructorioTracker.getSessionID.and.returnValue(constructorSessionID);
            global.ConstructorioTracker.getClientID.and.returnValue(constructorClientID);
            url = `${SEARCH_TYPE_AHEAD_URL}${query}&searchSuggestions=3&productSuggestions=6&categorySuggestions=5&constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}&targetSearchEngine=nlp&loc=${locale}&ch=${Sephora.channel}&sddZipcode=94301`;
            snbApi.searchTypeAhead(query);

            expect(ufeApi.makeRequest).toHaveBeenCalledWith(url, { method: 'GET' });
        });

        it('should call makeRequest method with Endeca if Constructor library is not available', () => {
            const constructorSessionID = undefined;
            const constructorClientID = undefined;
            global.ConstructorioTracker.getSessionID.and.returnValue(constructorSessionID);
            global.ConstructorioTracker.getClientID.and.returnValue(constructorClientID);
            url = `${SEARCH_TYPE_AHEAD_URL}${query}&searchSuggestions=3&productSuggestions=6&categorySuggestions=5&loc=${locale}&ch=${Sephora.channel}&sddZipcode=94301`;
            snbApi.searchTypeAhead(query);

            expect(ufeApi.makeRequest).toHaveBeenCalledWith(url, { method: 'GET' });
        });
    });

    describe('searchTypeAhead with Constructor disabled', () => {
        beforeEach(() => {
            query = 'red';
            Sephora.configurationSettings.isConstructorApiEnable = false;
            Sephora.configurationSettings.isNLPInstrumentationEnabled = true;
            Sephora.channel = 'rwd';
        });

        it('should call makeRequest with default params (Endeca)', () => {
            url = `${SEARCH_TYPE_AHEAD_URL}${query}&searchSuggestions=3&productSuggestions=6&categorySuggestions=5&loc=${locale}&ch=${Sephora.channel}&sddZipcode=94301`;
            snbApi.searchTypeAhead(query);

            expect(ufeApi.makeRequest).toHaveBeenCalledWith(url, { method: 'GET' });
        });
    });
});
