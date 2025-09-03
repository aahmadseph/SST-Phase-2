/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');

describe('StoreLocatorContent component', () => {
    const { any } = jasmine;
    let StoreLocatorContent;
    let wrapper;
    let component;

    beforeEach(() => {
        const scriptUtils = require('utils/LoadScripts').default;
        spyOn(scriptUtils, 'loadScripts');
        StoreLocatorContent = require('components/Stores/StoreLocator/StoreLocatorContent').default;
        wrapper = shallow(<StoreLocatorContent />, { disableLifecycleMethods: true });
        component = wrapper.instance();
    });

    describe('Curbside Pickup Indicator', () => {
        let curbsideStore;
        let state;

        beforeEach(() => {
            curbsideStore = {
                address: {
                    address1: '33 Powell Street',
                    address2: '',
                    city: 'San Francisco',
                    country: 'US',
                    crossStreet: 'Powell & Market Streets',
                    fax: '',
                    mallName: '',
                    phone: '(415) 362-9360',
                    postalCode: '94102',
                    state: 'CA'
                },
                displayName: 'Powell Street',
                distance: 1,
                email: 'Sephora.Powell@sephora.com',
                isBopisable: true,
                isCurbsideEnabled: true,
                isNoShowFeeApplicable: true,
                isOnlineReservationEnabled: true,
                isRopisable: false,
                isVirtual: false,
                latitude: 37.785,
                longitude: -122.408,
                seoCanonicalUrl: '/happening/stores/san-francisco-powell-street',
                storeHours: {
                    closedDays:
                        'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
                    fridayHours: '11:00AM-7:00PM',
                    mondayHours: '11:00AM-7:00PM',
                    saturdayHours: '11:00AM-7:00PM',
                    sundayHours: '12:00PM-6:00PM',
                    textColor: 'Black',
                    thursdayHours: '11:00AM-7:00PM',
                    timeZone: 'PST8PDT',
                    tuesdayHours: '11:00AM-7:00PM',
                    wednesdayHours: '11:00AM-7:00PM'
                },
                storeId: '0058',
                targetUrl: '/happening/stores/san-francisco-powell-street'
            };

            state = {
                currentLocation: 'San Francisco, CA',
                isLoaded: true,
                showListTab: true,
                showMapTab: false,
                showNoStoreResults: false,
                shownResults: 6,
                storeList: [curbsideStore]
            };
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            wrapper = shallow(<StoreLocatorContent />).setState(state);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(1);
        });

        it('should not render when BOPIS is disabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            wrapper = shallow(<StoreLocatorContent />).setState(state);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideStore.isBopisable = false;
            wrapper = shallow(<StoreLocatorContent />).setState(state);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideStore.isCurbsideEnabled = false;
            wrapper = shallow(<StoreLocatorContent />).setState(state);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });

        it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            curbsideStore.isBopisable = false;
            curbsideStore.isCurbsideEnabled = false;
            wrapper = shallow(<StoreLocatorContent />).setState(state);

            const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

            expect(curbsideIndicator.length).toEqual(0);
        });
    });

    describe('ctrlr', () => {
        let loadGoogleScriptStub;
        let getStoresAndUpdateStateStub;
        let userLocation;
        let determineLocationStub;
        let getDefaultStrategiesSequenceStub;

        beforeEach(() => {
            loadGoogleScriptStub = spyOn(component, 'loadGoogleScript');
            getStoresAndUpdateStateStub = spyOn(component, 'getStoresAndUpdateState');

            userLocation = require('utils/userLocation/UserLocation').default;
            determineLocationStub = spyOn(userLocation, 'determineLocation');
            getDefaultStrategiesSequenceStub = spyOn(userLocation, 'getDefaultStrategiesSequence').and.returnValue('defaultStrategies');

            component.componentDidMount();
        });

        it('should call loadGoogleScript with callback func', () => {
            expect(loadGoogleScriptStub).toHaveBeenCalledWith(any(Function));
        });

        it('should call determineLocation within callback function of loadGoogleScript', () => {
            loadGoogleScriptStub.calls.first().args[0]();
            expect(determineLocationStub).toHaveBeenCalledWith(any(Function), null, { sequence: 'defaultStrategies' });
        });

        it('should call getStoresAndUpdateState within callback function of determineLocation', () => {
            loadGoogleScriptStub.calls.first().args[0]();
            determineLocationStub.calls.first().args[0]('locationObj');
            expect(getStoresAndUpdateStateStub).toHaveBeenCalledWith('locationObj', true);
        });
    });

    describe('getStoresAndUpdateState', () => {
        let setStateStub;
        let decorators;
        let withIntersticeStub;
        let userLocation;
        let setNewLocationStub;
        let fakePromise;
        let storeUtils;
        let getStoresStub;
        let loadGoogleScriptStub;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');

            storeUtils = require('utils/Store').default;
            getStoresStub = spyOn(storeUtils, 'getStores');

            decorators = require('utils/decorators').default;
            withIntersticeStub = spyOn(decorators, 'withInterstice').and.returnValue(getStoresStub);

            userLocation = require('utils/userLocation/UserLocation').default;
            setNewLocationStub = spyOn(userLocation, 'setNewLocation');

            loadGoogleScriptStub = spyOn(component, 'loadGoogleScript');
        });

        it('should update state for currentLocation', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve({});
                    expect(setStateStub).toHaveBeenCalledWith({ currentLocation: 'location' });
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            getStoresStub.and.returnValue(Promise.resolve(fakePromise));
            component.getStoresAndUpdateState({ display: 'location' });
        });

        it('should setNewLocation in local storage if api if successful', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve('storeList');
                    expect(setNewLocationStub).toHaveBeenCalledWith({ display: 'location' });
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            getStoresStub.and.returnValue(fakePromise);
            component.getStoresAndUpdateState({ display: 'location' });
        });

        it('should update state for storeList and isLoaded if api is successful', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve('storeList');
                    expect(setStateStub).toHaveBeenCalledWith({ currentLocation: 'location' });
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            getStoresStub.and.returnValue(Promise.resolve(fakePromise));
            component.getStoresAndUpdateState({ display: 'location' });
        });

        it('should update state for storeList and isLoaded if api fails', done => {
            fakePromise = {
                then: function () {
                    return fakePromise;
                },
                catch: function (reject) {
                    reject();
                    expect(setStateStub).toHaveBeenCalledWith({
                        isLoaded: true,
                        showNoStoreResults: true
                    });
                    done();

                    return fakePromise;
                }
            };

            getStoresStub.and.returnValue(fakePromise);
            component.getStoresAndUpdateState({ display: 'location' });
        });
    });

    describe('toggleStoreListTab', () => {
        let setStateStub;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');
            component.toggleStoreListTab();
        });

        it('should update state to display list tab and hid map tab', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                showListTab: true,
                showMapTab: false
            });
        });
    });

    describe('toggleMapTab', () => {
        let setStateStub;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');
            component.toggleMapTab();
        });

        it('should update state to display map tab and hide list tab', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                showListTab: false,
                showMapTab: true
            });
        });
    });

    describe('openMapMarker', () => {
        let store;
        let dispatchStub;
        let ExperienceDetailsActions;
        let openInfoWindowStub;

        beforeEach(() => {
            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            ExperienceDetailsActions = require('actions/ExperienceDetailsActions').default;
            openInfoWindowStub = spyOn(ExperienceDetailsActions, 'openInfoWindow').and.returnValue('openInfoWindow');

            component.openMapMarker('storeId');
        });

        it('should dispatch openinfoWindow action', () => {
            expect(dispatchStub).toHaveBeenCalledWith('openInfoWindow');
        });

        it('should call openInfoWindow action with storeId', () => {
            expect(openInfoWindowStub).toHaveBeenCalledWith('storeId');
        });
    });
});
