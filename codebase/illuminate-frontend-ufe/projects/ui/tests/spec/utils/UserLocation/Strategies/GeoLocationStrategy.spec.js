const { createSpy } = jasmine;

describe('GeoLocationStrategy', () => {
    let GeoLocationStrategy;
    let GeoLocationStrategyInstance;
    let positionStub;
    let queryResultStub;

    beforeEach(() => {
        GeoLocationStrategy = require('utils/userLocation/Strategies/GeoLocationStrategy').default;
        GeoLocationStrategyInstance = new GeoLocationStrategy();
        positionStub = {
            coords: {
                latitude: 0.1234567,
                longitude: 100.7890123
            }
        };
        queryResultStub = { state: 'granted' };
    });

    describe('determineLocationAndCall', () => {
        let successStub;
        let failureStub;
        let doCallbackStub;
        let handleGeoLocationStub;

        beforeEach(() => {
            successStub = createSpy('successStub');
            failureStub = createSpy('failureStub');
            doCallbackStub = spyOn(GeoLocationStrategyInstance, 'doCallback');
            handleGeoLocationStub = spyOn(GeoLocationStrategyInstance, 'handleGeoLocationPermissions');
        });

        describe('if geolocation is not supported', () => {
            beforeEach(() => {
                spyOnProperty(navigator, 'geolocation', 'get').and.returnValue(null);
                GeoLocationStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should call failed', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });

            it('should call not success', () => {
                expect(successStub).not.toHaveBeenCalled();
            });
        });

        describe('if permissions are not supported', () => {
            beforeEach(() => {
                spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(callback => callback(positionStub));
                spyOnProperty(navigator, 'permissions', 'get').and.returnValue(null);
                GeoLocationStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should call next successor', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });

            it('should not call success', () => {
                expect(successStub).toHaveBeenCalledTimes(0);
            });

            it('should call doCallback', () => {
                expect(doCallbackStub).toHaveBeenCalledWith(positionStub, successStub);
            });
        });

        describe('if permissions are supported', () => {
            beforeEach(() => {
                GeoLocationStrategyInstance.determineLocationAndCall(successStub, failureStub);
            });

            it('should call handleGeoLocationPermissions if permissions are supported', () => {
                expect(handleGeoLocationStub).toHaveBeenCalled();
            });

            it('should not call failure', () => {
                expect(failureStub).not.toHaveBeenCalled();
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalled();
            });
        });
    });

    describe('handleGeoLocationPermissions', () => {
        let successStub;
        let failureStub;
        let doCallbackStub;
        let queryStub;

        beforeEach(() => {
            successStub = createSpy('successStub');
            failureStub = createSpy('failureStub');
            doCallbackStub = spyOn(GeoLocationStrategyInstance, 'doCallback');
            queryStub = spyOn(navigator.permissions, 'query');
        });

        describe('with state = granted', () => {
            beforeEach(() => {
                queryStub.and.returnValue({ then: callback => callback(queryResultStub) });
                spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(callback => callback(positionStub));
                GeoLocationStrategyInstance.handleGeoLocationPermissions(successStub, failureStub);
            });

            it('should not call failure', () => {
                expect(failureStub).not.toHaveBeenCalled();
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalled();
            });

            it('should call doCallback', () => {
                expect(doCallbackStub).toHaveBeenCalledWith(positionStub, successStub);
            });
        });

        describe('with state = denied', () => {
            beforeEach(() => {
                queryResultStub.state = 'denied';
                queryStub.and.returnValue({ then: callback => callback(queryResultStub) });
                GeoLocationStrategyInstance.handleGeoLocationPermissions(successStub, failureStub);
            });

            it('should call failure', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalled();
            });
        });

        describe('with state = prompt', () => {
            beforeEach(() => {
                queryResultStub.state = 'prompt';
                queryStub.and.returnValue({ then: callback => callback(queryResultStub) });
                spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(callback => callback(positionStub));
                GeoLocationStrategyInstance.handleGeoLocationPermissions(successStub, failureStub);
            });

            it('should call next successor', () => {
                expect(failureStub).toHaveBeenCalledTimes(1);
            });

            it('should not call success', () => {
                expect(successStub).not.toHaveBeenCalled();
            });

            it('should call doCallback', () => {
                expect(doCallbackStub).toHaveBeenCalledWith(positionStub, successStub);
            });
        });
    });

    describe('doCallback', () => {
        let successStub;
        let LOCATION;

        beforeEach(() => {
            LOCATION = require('utils/userLocation/Constants').default;
            successStub = createSpy();
        });

        it('should call success if position is valid', () => {
            GeoLocationStrategyInstance.doCallback(positionStub, successStub);
            expect(successStub).toHaveBeenCalledWith({
                src: LOCATION.TYPES.GEOLOCATION,
                display: LOCATION.CURRENT_LOCATION_TEXT,
                lat: 0.1234567,
                lon: 100.7890123
            });
        });

        it('should not call success if position is invalid', () => {
            GeoLocationStrategyInstance.doCallback(undefined, successStub);
            expect(successStub).not.toHaveBeenCalled();
        });
    });
});
