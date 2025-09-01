/* eslint-disable no-unused-vars */
const { createSpy } = jasmine;

describe('IpStrategy', () => {
    let IpStrategy;
    let IpStrategyInstance;
    let localeUtils;
    let dataStub;

    beforeEach(() => {
        IpStrategy = require('utils/userLocation/Strategies/IpStrategy').default;
        IpStrategyInstance = new IpStrategy();
        localeUtils = require('utils/LanguageLocale').default;
        dataStub = {
            location: {
                latitude: 0.1234567,
                longitude: 100.7890123,
                countryCode: 'US'
            },
            stores: ['store1', 'store2']
        };
    });

    describe('determineLocationAndCall', () => {
        let utilityApi;
        let getLocationStub;
        let parseLocatorDataStub;
        let successStub;
        let failureStub;

        beforeEach(() => {
            spyOn(localeUtils, 'isUS').and.returnValue(true);
            utilityApi = require('services/api/utility').default;
            getLocationStub = spyOn(utilityApi, 'getLocation');
            getLocationStub.and.returnValue({
                then: callback => {
                    callback(dataStub);
                }
            });
            parseLocatorDataStub = spyOn(IpStrategyInstance, 'parseLocatorData');
            successStub = createSpy();
            failureStub = createSpy();
            IpStrategyInstance.determineLocationAndCall(successStub, failureStub);
        });

        it('should call parseLocatorData with correct args', () => {
            expect(parseLocatorDataStub).toHaveBeenCalledWith(dataStub, successStub, failureStub);
        });

        it('should not call success', () => {
            expect(successStub).not.toHaveBeenCalledTimes(1);
        });

        it('should not call failure', () => {
            expect(failureStub).not.toHaveBeenCalledTimes(1);
        });
    });

    describe('parseLocatorData', () => {
        let successStub;
        let failureStub;
        let getGeocoderStub;
        let resultsStub;
        let LOCATION;
        let isValidCountryStub;

        beforeEach(() => {
            LOCATION = require('utils/userLocation/Constants').default;
            isValidCountryStub = spyOn(localeUtils, 'isValidCountry').and.returnValue(true);
            successStub = createSpy('successStub');
            failureStub = createSpy('failureStub');
            getGeocoderStub = spyOn(IpStrategyInstance, 'getGeocoder').and.returnValue({
                geocode: (params, callback) => {
                    callback(resultsStub, 'OK');
                }
            });
            /* eslint-disable camelcase */
            resultsStub = [
                {
                    formatted_address: 'San Francisco, CA, USA',
                    types: ['locality', 'political']
                }
            ];
            /* eslint-enable camelcase */
        });

        describe('with malformed data', () => {
            beforeEach(() => {
                IpStrategyInstance.parseLocatorData(null, successStub, failureStub);
            });

            it('should call failure', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalledTimes(1);
            });
        });

        describe('with malformed geocoder response', () => {
            beforeEach(() => {
                resultsStub = null;
                IpStrategyInstance.parseLocatorData(dataStub, successStub, failureStub);
            });

            it('should call failure', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalledTimes(1);
            });
        });

        describe('with cvalid geocoder response', () => {
            beforeEach(() => {
                IpStrategyInstance.parseLocatorData(dataStub, successStub, failureStub);
            });

            it('should call isValidCountry', () => {
                expect(isValidCountryStub).toHaveBeenCalledWith('US');
            });

            it('should not call failure', () => {
                expect(failureStub).not.toHaveBeenCalledTimes(1);
            });

            it('should call success with correct args', () => {
                expect(successStub).toHaveBeenCalledWith(
                    {
                        src: LOCATION.TYPES.IP,
                        display: 'San Francisco, CA',
                        lat: 0.1234567,
                        lon: 100.7890123,
                        country: 'US'
                    },
                    ['store1', 'store2']
                );
            });
        });
    });
});
