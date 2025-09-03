/* eslint-disable object-curly-newline */
const React = require('react');
const { any, arrayContaining, createSpy } = jasmine;
const { shallow } = require('enzyme');

xdescribe('OrderConfirmation component', () => {
    let OrderConfirmation;
    let component;
    let wrapper;

    beforeEach(() => {
        OrderConfirmation = require('components/OrderConfirmation/OrderConfirmation').default;
    });

    describe('ctrlr', () => {
        let store;
        let setAndWatchStub;
        let setStateStub;
        let userUtils;
        let isDefaultBIBirthDayStub;
        let getBiStatusStub;
        let BiProfile;
        let hasAllTraitsStub;
        let isUSStub;
        let localeUtils;
        let isBIStub;

        beforeEach(() => {
            Sephora = {
                analytics: { initialLoadDependencies: [] },
                configurationSettings: { isBIAutoEnrollEnabled: true },
                Util: { InflatorComps: { services: { loadEvents: { HydrationFinished: true } } } }
            };

            store = require('Store').default;
            setAndWatchStub = spyOn(store, 'setAndWatch');

            userUtils = require('utils/User').default;
            isDefaultBIBirthDayStub = spyOn(userUtils, 'isDefaultBIBirthDay');
            getBiStatusStub = spyOn(userUtils, 'getBiStatus');
            isBIStub = spyOn(userUtils, 'isBI');

            BiProfile = require('utils/BiProfile').default;
            hasAllTraitsStub = spyOn(BiProfile, 'hasAllTraits');

            localeUtils = require('utils/LanguageLocale').default;
            isUSStub = spyOn(localeUtils, 'isUS');
            isUSStub.and.returnValue(true);

            wrapper = shallow(<OrderConfirmation />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should call first setAndWatch with correct args', () => {
            expect(setAndWatchStub.calls.argsFor(0)).toEqual(arrayContaining(['order.orderDetails', component, any(Function)]));
        });

        //TODO: describe for what occurs inside first setAndWatch

        it('should call second setAndWatch with correct args', () => {
            expect(setAndWatchStub.calls.argsFor(1)).toEqual(arrayContaining(['user', component, any(Function)]));
        });

        describe('Second Set And Watch', () => {
            beforeEach(() => {
                isBIStub.and.returnValue(true);
                isDefaultBIBirthDayStub.and.returnValue(false);
                getBiStatusStub.and.returnValue('BI');
                hasAllTraitsStub.and.returnValue(false);
                setAndWatchStub.calls.argsFor(1)[2]({
                    user: {
                        login: 'email@email.com'
                    }
                });
            });

            it('should call isDefaultBIBirthDay once', () => {
                expect(isDefaultBIBirthDayStub).toHaveBeenCalled();
            });

            it('should call getBiStatus once', () => {
                expect(getBiStatusStub).toHaveBeenCalled();
            });

            it('should call hasAllTraits once', () => {
                expect(hasAllTraitsStub).toHaveBeenCalled();
            });

            it('should update state for order conf component', () => {
                expect(setStateStub).toHaveBeenCalled();
                expect(setStateStub).toHaveBeenCalledWith({
                    userEmail: 'email@email.com',
                    showBeautyInsiderSection: true,
                    showBirthdayForAutoEnrolled: false,
                    biStatus: 'BI',
                    hasAllTraits: false
                });
            });
        });

        it('should call third setAndWatch with correct args', () => {
            expect(setAndWatchStub.calls.argsFor(2)).toEqual(arrayContaining(['user', component, any(Function)]));
        });

        //TODO: describe for what occurs inside third setAndWatch

        it('should call fourth setAndWatch with correct args', () => {
            expect(setAndWatchStub.calls.argsFor(3)).toEqual(arrayContaining(['basket', component, any(Function)]));
        });
    });

    describe('fireConstructorPurchaseEvent', () => {
        beforeEach(() => {
            window.ConstructorioTracker = {
                trackPurchase: createSpy()
            };

            spyOn(Sephora.Util, 'onLastLoadEvent').and.callFake(function (selector, event, callback) {
                callback();
            });

            wrapper = shallow(<OrderConfirmation />, { disableLifecycleMethods: true });
            component = wrapper.instance();
        });

        it('should call window.ConstructorioTracker.trackPurchase with the correct data', () => {
            const trackPurchaseSpy = window.ConstructorioTracker.trackPurchase;
            component.fireConstructorPurchaseEvent('id123', '$40.00', [{ id: 'p123' }, { id: 'p234' }]);
            expect(trackPurchaseSpy.calls.argsFor(0)).toEqual(
                arrayContaining([
                    // prettier-ignore
                    {
                        'customer_ids': ['p123', 'p234'],
                        revenue: 40,
                        'order_id': 'id123'
                    }
                ])
            );
        });

        it('should call window.ConstructorioTracker.trackPurchase with the correct revenue if gift card purchase', () => {
            const trackPurchaseSpy = window.ConstructorioTracker.trackPurchase;
            component.fireConstructorPurchaseEvent('id123', '$40.00', [{ id: 'p123' }, { id: 'p234' }], '$50.00');
            expect(trackPurchaseSpy.calls.argsFor(0)).toEqual(
                arrayContaining([
                    // prettier-ignore
                    {
                        'customer_ids': ['p123', 'p234'],
                        revenue: 90,
                        'order_id': 'id123'
                    }
                ])
            );
        });
    });
});
