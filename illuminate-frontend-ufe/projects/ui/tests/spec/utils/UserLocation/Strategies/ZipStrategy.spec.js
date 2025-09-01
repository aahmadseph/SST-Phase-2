const { createSpy } = jasmine;

describe('ZipStrategy', () => {
    let ZipStrategy;
    let ZipStrategyInstance;
    let urlUtils;
    let localeUtils;
    let LOCATION;

    beforeEach(() => {
        ZipStrategy = require('utils/userLocation/Strategies/ZipStrategy').default;
        ZipStrategyInstance = new ZipStrategy();
        urlUtils = require('utils/Url').default;
        localeUtils = require('utils/LanguageLocale').default;
        LOCATION = require('utils/userLocation/Constants').default;
    });

    describe('determineLocationAndCall', () => {
        let isValidCountryStub;
        let getParamsStub;
        let getGeocoderStub;
        let successStub;
        let failureStub;
        let resultsStub;

        beforeEach(() => {
            isValidCountryStub = spyOn(localeUtils, 'isValidCountry').and.returnValue(false);
            getParamsStub = spyOn(urlUtils, 'getParams').and.returnValue({ zipCode: ['11011'] });
            getGeocoderStub = spyOn(ZipStrategyInstance, 'getGeocoder').and.returnValue({
                geocode: (params, callback) => {
                    callback(resultsStub, 'OK');
                }
            });
            successStub = createSpy('successStub');
            failureStub = createSpy('failureStub');
            /* eslint-disable camelcase */
            resultsStub = [
                {
                    geometry: {
                        location: {
                            lat: () => 0.1234567,
                            lng: () => 100.7890123
                        }
                    },
                    address_components: [
                        {
                            long_name: 'San Francisco',
                            short_name: 'SF',
                            types: ['locality', 'political']
                        },
                        {
                            long_name: 'United States',
                            short_name: 'US',
                            types: ['country', 'political']
                        }
                    ]
                }
            ];
            /* eslint-enable camelcase */
        });

        it('should call getParams', () => {
            ZipStrategyInstance.determineLocationAndCall(successStub, failureStub);
            expect(getParamsStub).toHaveBeenCalledTimes(1);
        });

        it('should call getGeocoder', () => {
            ZipStrategyInstance.determineLocationAndCall(successStub, failureStub);
            expect(getGeocoderStub).toHaveBeenCalledTimes(1);
        });

        describe('if zip is missing', () => {
            beforeEach(() => {
                getParamsStub.and.returnValue(null);
                ZipStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalledTimes(1);
            });

            it('should call failure', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });
        });

        describe('if geocoder results are invalid', () => {
            beforeEach(() => {
                resultsStub = [];
                ZipStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalledTimes(1);
            });

            it('should call failure', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });
        });

        describe('if geocoder results are valid', () => {
            let expectedLocationObj;

            beforeEach(() => {
                expectedLocationObj = {
                    src: LOCATION.TYPES.URL_ZIP,
                    display: '11011',
                    lat: 0.1234567,
                    lon: 100.7890123
                };
            });

            it('should not call failure', () => {
                ZipStrategyInstance.determineLocationAndCall(successStub, failureStub);
                expect(failureStub).not.toHaveBeenCalledTimes(1);
            });

            it('should call suucess with correct locationObj', () => {
                ZipStrategyInstance.determineLocationAndCall(successStub, failureStub);
                expect(successStub).toHaveBeenCalledWith(expectedLocationObj);
            });

            it('should call suucess with correct locationObj including country', () => {
                isValidCountryStub.and.returnValue(true);
                expectedLocationObj.country = 'US';
                ZipStrategyInstance.determineLocationAndCall(successStub, failureStub);
                expect(successStub).toHaveBeenCalledWith(expectedLocationObj);
            });
        });
    });
});
