/* eslint-disable no-unused-vars */
const { createSpy } = jasmine;

describe('UserLocation', () => {
    let UserLocation;
    let LOCATION;

    beforeEach(() => {
        LOCATION = require('utils/userLocation/Constants').default;
        UserLocation = require('utils/userLocation/UserLocation').default;
    });

    const getNotEmptyList = list => {
        return list.filter(i => typeof i === 'string' && i.length > 0);
    };

    describe('getDefaultStrategiesSequence', () => {
        it('should return array of strategy names', () => {
            const list = UserLocation.getDefaultStrategiesSequence();
            expect(list.length).toEqual(getNotEmptyList(list).length);
        });
    });

    describe('getHubStrategiesSequence', () => {
        it('should return array of strategy names', () => {
            const list = UserLocation.getHubStrategiesSequence();
            expect(list.length).toEqual(getNotEmptyList(list).length);
        });
    });

    describe('determineLocation', () => {
        let callbackStub;
        let failureStub;
        let setNextStub;
        let determineLocationAndCallStub;
        let getHubStrategiesMapStub;
        let getDefaultSequenceStub;

        beforeEach(() => {
            callbackStub = createSpy('callbackStub');
            failureStub = createSpy('failureStub');
            setNextStub = createSpy('setNextStub');
            determineLocationAndCallStub = createSpy('determineLocationAndCallStub');
            const strategyStub = {
                setNext: setNextStub,
                determineLocationAndCall: determineLocationAndCallStub
            };
            setNextStub.and.returnValue(strategyStub);
            getHubStrategiesMapStub = spyOn(UserLocation, 'getHubStrategiesMap').and.returnValue({
                STRATEGY_A: createSpy('STRATEGY_A').and.returnValue(strategyStub),
                STRATEGY_B: createSpy('STRATEGY_B').and.returnValue(strategyStub),
                STRATEGY_C: createSpy('STRATEGY_C').and.returnValue(strategyStub)
            });
            getDefaultSequenceStub = spyOn(UserLocation, 'getDefaultStrategiesSequence').and.returnValue(['STRATEGY_A', 'STRATEGY_B', 'STRATEGY_C']);
            UserLocation.determineLocation(callbackStub, failureStub);
        });

        it('should call getHubStrategiesMap', () => {
            expect(getHubStrategiesMapStub).toHaveBeenCalledTimes(1);
        });

        it('should call getDefaultSequence if missing in config', () => {
            expect(getDefaultSequenceStub).toHaveBeenCalledTimes(1);
        });

        it('should call setNext for all but last strategies', () => {
            expect(setNextStub).toHaveBeenCalledTimes(2);
        });

        it('should call determineLocationAndCall on the first strategy only', () => {
            expect(determineLocationAndCallStub).toHaveBeenCalledTimes(1);
        });

        it('determineLocationAndCall first arg shown call callback once', () => {
            determineLocationAndCallStub.calls.first().args[0]();
            expect(callbackStub).toHaveBeenCalledTimes(1);
        });

        it('determineLocationAndCall first arg shown call callback with correct args', () => {
            determineLocationAndCallStub.calls.first().args[0]('locationObj', 'storeList');
            expect(callbackStub).toHaveBeenCalledWith('locationObj', 'storeList');
        });

        it('determineLocationAndCall second arg shown call failure once', () => {
            determineLocationAndCallStub.calls.first().args[1]();
            expect(failureStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('getLocationFromPosition', () => {
        it('should return locationObj if position is correct', () => {
            const locationObj = UserLocation.getLocationFromPosition({
                coords: {
                    latitude: '0.1234567',
                    longitude: '100.7890123'
                }
            });
            expect(locationObj).toEqual({
                src: LOCATION.TYPES.GEOLOCATION,
                display: LOCATION.CURRENT_LOCATION_TEXT,
                lat: 0.1234567,
                lon: 100.7890123
            });
        });

        it('should return retrun null position is not passed', () => {
            expect(UserLocation.getLocationFromPosition()).toEqual(null);
        });

        it('should return retrun null position is malformed', () => {
            const malformedPosition = {
                coords: {
                    latitude: '0.1234567',
                    lon: 7
                }
            };
            expect(UserLocation.getLocationFromPosition(malformedPosition)).toEqual(null);
        });
    });

    describe('getLocationFromPrediction', () => {
        let localeUtils;
        let isZipCodeStub;
        let isPostalCodeStub;
        let isValidCountryStub;

        /* eslint-disable camelcase */
        const prediction = {
            terms: [
                {
                    offset: 0,
                    value: 'San Francisco'
                },
                {
                    offset: 15,
                    value: 'CA'
                },
                {
                    offset: 19,
                    value: 'USA'
                }
            ],
            geometry: {
                location: {
                    lat: () => 0.1234567,
                    lng: () => 100.7890123
                }
            },
            addressComponents: [
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
        };
        const structuredFormatting = { structured_formatting: { main_text: '11011' } };
        /* eslint-enable camelcase */

        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            isZipCodeStub = spyOn(localeUtils, 'isZipCode').and.returnValue(false);
            isPostalCodeStub = spyOn(localeUtils, 'isPostalCode').and.returnValue(false);
            isValidCountryStub = spyOn(localeUtils, 'isValidCountry').and.returnValue(true);
        });

        it('should return locationObj on valid not zip based prediction', () => {
            const locationObj = UserLocation.getLocationFromPrediction(prediction);
            const expectedLocationObj = {
                src: LOCATION.TYPES.PREDICTION,
                display: 'San Francisco, CA',
                lat: 0.1234567,
                lon: 100.7890123,
                country: 'US'
            };
            expect(locationObj).toEqual(expectedLocationObj);
        });

        it('should not include country if invalid', () => {
            isValidCountryStub.and.returnValue(false);
            const locationObj = UserLocation.getLocationFromPrediction(prediction);
            const expectedLocationObj = {
                src: LOCATION.TYPES.PREDICTION,
                display: 'San Francisco, CA',
                lat: 0.1234567,
                lon: 100.7890123
            };
            expect(locationObj).toEqual(expectedLocationObj);
        });

        it('should return locationObj on valid zip based prediction', () => {
            isZipCodeStub.and.returnValue(true);
            const zipBasedPrediction = Object.assign({}, prediction, structuredFormatting);
            const locationObj = UserLocation.getLocationFromPrediction(zipBasedPrediction);
            const expectedLocationObj = {
                src: LOCATION.TYPES.PREDICTION,
                display: '11011',
                lat: 0.1234567,
                lon: 100.7890123,
                country: 'US'
            };
            expect(locationObj).toEqual(expectedLocationObj);
        });

        it('should return locationObj on invalid zip based prediction', () => {
            isZipCodeStub.and.returnValue(false);
            const zipBasedPrediction = Object.assign({}, prediction, structuredFormatting);
            const locationObj = UserLocation.getLocationFromPrediction(zipBasedPrediction);
            const expectedLocationObj = {
                src: LOCATION.TYPES.PREDICTION,
                display: 'San Francisco, CA',
                lat: 0.1234567,
                lon: 100.7890123,
                country: 'US'
            };
            expect(locationObj).toEqual(expectedLocationObj);
        });
    });

    describe('hasUrlBasedSource', () => {
        it('should return true if locationObj has a url based source', () => {
            expect(UserLocation.hasUrlBasedSource({ src: LOCATION.URL_BASED_TYPES[0] })).toEqual(true);
        });

        it('should return false if locationObj is invalid', () => {
            expect(UserLocation.hasUrlBasedSource({ key: 'value' })).toEqual(false);
        });

        it('should return false if locationObj does not have url based source', () => {
            expect(UserLocation.hasUrlBasedSource({ src: 'other_type' })).toEqual(false);
        });
    });

    describe('setNewLocation', () => {
        let removeStorageLocationStub;
        let setStorageLocationStub;
        let addToPreviousLocationsStub;
        const locationObj = {};

        beforeEach(() => {
            removeStorageLocationStub = spyOn(UserLocation, 'removeStorageLocation');
            setStorageLocationStub = spyOn(UserLocation, 'setStorageLocation');
            addToPreviousLocationsStub = spyOn(UserLocation, 'addToPreviousLocationsList');
            locationObj.src = LOCATION.TYPES.PREDICTION;
        });

        it('should call removeStorageLocation', () => {
            UserLocation.setNewLocation(locationObj);
            expect(removeStorageLocationStub).toHaveBeenCalledTimes(1);
        });

        describe('for storable src type', () => {
            beforeEach(() => {
                locationObj.src = LOCATION.STORABLE_TYPES[0];
                UserLocation.setNewLocation(locationObj);
            });

            it('should call setStorageLocation', () => {
                expect(setStorageLocationStub).toHaveBeenCalledWith(locationObj);
            });

            it('should call addToPreviousLocationsList', () => {
                expect(addToPreviousLocationsStub).toHaveBeenCalledWith(locationObj);
            });
        });

        describe('for not storable src type', () => {
            beforeEach(() => {
                locationObj.src = 'not_sortabe_type';
                UserLocation.setNewLocation(locationObj);
            });

            it('should not call setStorageLocation', () => {
                expect(setStorageLocationStub).not.toHaveBeenCalled();
            });

            it('should not call addToPreviousLocationsList', () => {
                expect(addToPreviousLocationsStub).not.toHaveBeenCalled();
            });
        });
    });

    describe('setStorageLocation', () => {
        let Storage;
        let LOCAL_STORAGE;
        let setItemStub;
        const locationObj = {};

        beforeEach(() => {
            Storage = require('utils/localStorage/Storage').default;
            LOCAL_STORAGE = require('utils/localStorage/Constants').default;
            setItemStub = spyOn(Storage.local, 'setItem');
            locationObj.src = LOCATION.TYPES.PREDICTION;
        });

        it('should call Storage.local.setItem with correct args', () => {
            UserLocation.setStorageLocation(locationObj);
            expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.EXPERIENCE_LOCATION, locationObj);
        });
    });

    describe('removeStorageLocation', () => {
        let Storage;
        let LOCAL_STORAGE;
        let removeItemStub;

        beforeEach(() => {
            Storage = require('utils/localStorage/Storage').default;
            LOCAL_STORAGE = require('utils/localStorage/Constants').default;
            removeItemStub = spyOn(Storage.local, 'removeItem');
        });

        it('should call Storage.local.removeItem with correct args', () => {
            UserLocation.removeStorageLocation();
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.EXPERIENCE_LOCATION);
        });
    });

    describe('addToPreviousLocationsList', () => {
        let Storage;
        let LOCAL_STORAGE;
        let setItemStub;
        let getItemStub;
        let locationObj = {};

        beforeEach(() => {
            Storage = require('utils/localStorage/Storage').default;
            LOCAL_STORAGE = require('utils/localStorage/Constants').default;
            setItemStub = spyOn(Storage.local, 'setItem');
            getItemStub = spyOn(Storage.local, 'getItem');
            locationObj = { display: 'display1' };
            LOCATION.STORAGE_MAX_SIZE = 4;
        });

        it('should call Storage.local.getItem with correct args', () => {
            UserLocation.addToPreviousLocationsList(locationObj);
            expect(getItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.PREVIOUS_EXPERIENCE_LOCATIONS);
        });

        it('should put new item on the top of the list', () => {
            getItemStub.and.returnValue([{ display: 'display2' }, { display: 'display3' }]);
            UserLocation.addToPreviousLocationsList(locationObj);
            expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.PREVIOUS_EXPERIENCE_LOCATIONS, [
                { display: 'display1' },
                { display: 'display2' },
                { display: 'display3' }
            ]);
        });

        it('should remove new item from existing list if found', () => {
            getItemStub.and.returnValue([{ display: 'display3' }, { display: 'display1' }, { display: 'display2' }]);
            UserLocation.addToPreviousLocationsList(locationObj);
            expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.PREVIOUS_EXPERIENCE_LOCATIONS, [
                { display: 'display1' },
                { display: 'display3' },
                { display: 'display2' }
            ]);
        });

        it('should slice the list if exceeds STORAGE_MAX_SIZE', () => {
            getItemStub.and.returnValue([{ display: 'display2' }, { display: 'display3' }, { display: 'display4' }, { display: 'display5' }]);
            UserLocation.addToPreviousLocationsList(locationObj);
            expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.PREVIOUS_EXPERIENCE_LOCATIONS, [
                { display: 'display1' },
                { display: 'display2' },
                { display: 'display3' },
                { display: 'display4' }
            ]);
        });
    });
});
