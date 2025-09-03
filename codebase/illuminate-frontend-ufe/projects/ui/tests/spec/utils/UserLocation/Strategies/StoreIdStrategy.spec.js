const { createSpy } = jasmine;

describe('StoreIdStrategy', () => {
    let StoreIdStrategy;
    let StoreIdStrategyInstance;
    let urlUtils;
    let storeLocator;
    let localeUtils;
    let LOCATION;

    beforeEach(() => {
        StoreIdStrategy = require('utils/userLocation/Strategies/StoreIdStrategy').default;
        StoreIdStrategyInstance = new StoreIdStrategy();
        storeLocator = require('services/api/utility/storeLocator').default;
        urlUtils = require('utils/Url').default;
        localeUtils = require('utils/LanguageLocale').default;
        LOCATION = require('utils/userLocation/Constants').default;
    });

    describe('determineLocationAndCall', () => {
        let isValidCountryStub;
        let getParamsStub;
        let getStoreLocationsStub;
        let successStub;
        let failureStub;
        let responseStub;

        beforeEach(() => {
            isValidCountryStub = spyOn(localeUtils, 'isValidCountry').and.returnValue(false);
            getParamsStub = spyOn(urlUtils, 'getParams').and.returnValue({ storeId: ['0058'] });
            responseStub = {
                responseStatus: 200,
                stores: [
                    {
                        storeId: '0058',
                        latitude: '0.1234567',
                        longitude: '100.7890123',
                        address: {
                            postalCode: '10011',
                            country: 'US'
                        }
                    }
                ]
            };
            getStoreLocationsStub = spyOn(storeLocator, 'getStoreLocations').and.returnValue({
                then: success => {
                    success(responseStub);
                }
            });
            successStub = createSpy('successStub');
            failureStub = createSpy('failureStub');
        });

        it('should call getParams', () => {
            StoreIdStrategyInstance.determineLocationAndCall(successStub, failureStub);
            expect(getParamsStub).toHaveBeenCalledTimes(1);
        });

        it('should call getStoreLocations', () => {
            StoreIdStrategyInstance.determineLocationAndCall(successStub, failureStub);
            expect(getStoreLocationsStub).toHaveBeenCalledTimes(1);
        });

        it('should throw error if getStoreLocations results are invalid', () => {
            expect(() => {
                responseStub.responseStatus = 500;
                StoreIdStrategyInstance.determineLocationAndCall(successStub, failureStub);
            }).toThrow(new Error('Invalid store availabilities response.'));
            expect(successStub).not.toHaveBeenCalledTimes(1);
        });

        describe('if storeId is missing ', () => {
            beforeEach(() => {
                getParamsStub.and.returnValue(null);
                StoreIdStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalledTimes(1);
            });

            it('should call failure', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });
        });

        describe('if getStoreLocations results are valid', () => {
            beforeEach(() => {
                isValidCountryStub.and.returnValue(true);
                StoreIdStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should call isValidCountry', () => {
                expect(isValidCountryStub).toHaveBeenCalledTimes(1);
            });

            it('should call success with correct args', () => {
                expect(successStub).toHaveBeenCalledWith(
                    {
                        src: LOCATION.TYPES.URL_STORE_ID,
                        display: '10011',
                        lat: 0.1234567,
                        lon: 100.7890123,
                        country: 'US'
                    },
                    [responseStub.stores[0]]
                );
            });

            it('should not call failure', () => {
                expect(failureStub).not.toHaveBeenCalledTimes(1);
            });
        });
    });
});
