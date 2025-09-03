/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');

describe('StoreDetails component', () => {
    const { any } = jasmine;
    let StoreDetails;
    let component;
    let setStateStub;
    const storeStub = {
        storeId: '0001',
        address: {
            city: 'San Francisco',
            state: 'CA'
        },
        latitude: 1,
        longitude: 2,
        distance: null
    };
    const locationObjStub = {
        display: 'San Francisco',
        lat: 0.1234567,
        lon: 100.7890123
    };

    beforeEach(() => {
        StoreDetails = require('components/Content/Happening/StoreDetails/StoreDetails').default;
        const wrapper = shallow(<StoreDetails />, { disableLifecycleMethods: true });
        component = wrapper.instance();
        setStateStub = spyOn(component, 'setState');
    });

    describe('updateDistance', () => {
        let localeUtils;
        let GisUtil;
        let userLocation;
        let getConfigStub;
        let getDistanceStub;
        let determineLocationStub;

        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            GisUtil = require('utils/Gis').default;
            userLocation = require('utils/userLocation/UserLocation').default;
            getConfigStub = spyOn(GisUtil, 'getDefaultDistanceConfig');
            getConfigStub.and.returnValue({
                radius: GisUtil.EARTH_RADIUS.MI,
                threshold: 25
            });
            getDistanceStub = spyOn(GisUtil, 'getDistance').and.returnValue(5.235);
            determineLocationStub = spyOn(userLocation, 'determineLocation');
            component.updateDistance(storeStub);
        });

        it('should call determineLocation', () => {
            expect(determineLocationStub).toHaveBeenCalledWith(any(Function));
        });

        it('should call getDefaultDistanceConfig', () => {
            determineLocationStub.calls.first().args[0](locationObjStub);
            expect(getConfigStub).toHaveBeenCalledTimes(1);
        });

        it('should call getDistance with correct arguments', () => {
            determineLocationStub.calls.first().args[0](locationObjStub);
            expect(getDistanceStub).toHaveBeenCalledWith(locationObjStub.lat, locationObjStub.lon, storeStub.latitude, storeStub.longitude, {
                radius: GisUtil.EARTH_RADIUS.MI,
                threshold: 25
            });
        });

        it('should call setState with correct arguments', () => {
            determineLocationStub.calls.first().args[0](locationObjStub);
            expect(setStateStub).toHaveBeenCalledWith({
                store: {
                    storeId: '0001',
                    address: {
                        city: 'San Francisco',
                        state: 'CA'
                    },
                    latitude: 1,
                    longitude: 2,
                    distance: 6
                }
            });
        });
    });
});
