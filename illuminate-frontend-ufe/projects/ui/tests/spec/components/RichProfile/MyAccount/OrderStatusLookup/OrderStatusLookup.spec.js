const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('OrderStatusLookup component', () => {
    let OrderStatusLookup, ErrorUtils, props, component;

    beforeEach(() => {
        OrderStatusLookup = require('components/RichProfile/MyAccount/OrderStatusLookup/OrderStatusLookup').default;

        props = {
            validateUserStatusAndGetProfileSettings: () => {}
        };
        const wrapper = shallow(<OrderStatusLookup {...props} />);
        component = wrapper.instance();
    });

    describe('ctrlr', () => {
        let store;
        let setAndWatchSpy;
        let userUtils;

        beforeEach(() => {
            store = require('Store').default;
            setAndWatchSpy = spyOn(store, 'setAndWatch');
            userUtils = require('utils/User').default;
        });

        it('shoud call setAndWatch', () => {
            component.componentDidMount();
            expect(setAndWatchSpy).toHaveBeenCalledWith('user', component, any(Function));
        });

        it('should set showSignInText state based on isSignedIn util', () => {
            spyOn(userUtils, 'isSignedIn').and.returnValue(true);
            component.componentDidMount();
            setAndWatchSpy.calls.first().args[2]();
            expect(component.state.showSignInText).toBeFalsy();
        });
    });

    describe('showSignInText', () => {
        let userUtils;
        let isSignedInSpy;

        beforeEach(() => {
            userUtils = require('utils/User').default;
            isSignedInSpy = spyOn(userUtils, 'isSignedIn');
        });

        it('should return opposite value to opposite of what userUtils.isSignedIn returns', () => {
            isSignedInSpy.and.returnValue(true);
            expect(component.showSignInText()).toEqual(false);
        });

        it('should return opposite value to opposite of what userUtils.isSignedIn returns', () => {
            isSignedInSpy.and.returnValue(false);
            expect(component.showSignInText()).toEqual(true);
        });
    });

    describe('resetErrorState', () => {
        let storeSetStateSpy;

        it('should set null all state params', () => {
            storeSetStateSpy = spyOn(component, 'setState');

            component.resetErrorState();

            expect(storeSetStateSpy).toHaveBeenCalledWith({ error: null });
        });
    });

    describe('setErrorState', () => {
        let msg, storeSetStateSpy;

        it('should set msg as an error state param', () => {
            storeSetStateSpy = spyOn(component, 'setState');
            msg = 'Some message';
            component.setErrorState(msg);

            expect(storeSetStateSpy).toHaveBeenCalledWith({ error: msg });
        });
    });

    describe('isValid', () => {
        let validateStub;

        beforeEach(() => {
            ErrorUtils = require('utils/Errors').default;
            validateStub = spyOn(ErrorUtils, 'validate');
        });

        it('should return false if formValidator returns obj with fields.length > 0', () => {
            validateStub.and.returnValue(true);

            expect(component.isValid()).toEqual(false);
        });

        it('should return true if formValidator returns obj with fields.length = 0', () => {
            validateStub.and.returnValue(false);

            expect(component.isValid()).toEqual(true);
        });
    });

    describe('checkOrder', () => {
        let isValidStub, preventDefaultStub, event, requestAPISpy;

        beforeEach(() => {
            component = Object.assign(component, {
                emailInput: { getValue: () => 'testEmailValue' },
                orderIdInput: { getValue: () => 'testIdValue' }
            });

            isValidStub = spyOn(component, 'isValid');
            requestAPISpy = spyOn(component, 'requestAPI');

            preventDefaultStub = createSpy();
            event = { preventDefault: preventDefaultStub };
        });

        it('should call api if data is valid', () => {
            isValidStub.and.returnValue(true);

            component.checkOrder(event);
            expect(requestAPISpy).toHaveBeenCalledWith('testIdValue', 'testEmailValue');
        });

        it('should not call api if data is invalid', () => {
            isValidStub.and.returnValue(false);

            component.checkOrder(event);
            expect(requestAPISpy).not.toHaveBeenCalled();
        });
    });

    describe('requestAPI', () => {
        let utilityApi;
        let getGuestOrderDetailsStub;

        beforeEach(() => {
            utilityApi = require('services/api/checkout').default;
        });

        it('shoud call getGuestOrderDetails', () => {
            getGuestOrderDetailsStub = spyOn(utilityApi, 'getGuestOrderDetails').and.returnValue({
                then: createSpy().and.returnValue({ catch: () => {} })
            });
            component.requestAPI('123', 'email@email.com');
            expect(getGuestOrderDetailsStub).toHaveBeenCalledWith('123', 'email@email.com');
        });
    });

    describe('signInHandler', () => {
        let auth = require('utils/Authentication').default;
        let requireAuthenticationStub;

        beforeEach(() => {
            auth = require('utils/Authentication').default;
        });

        it('shoud call requireAuthentication', () => {
            const fakePromise = {
                then: () => fakePromise,
                catch: () => {}
            };
            requireAuthenticationStub = spyOn(auth, 'requireAuthentication').and.returnValue(fakePromise);
            component.signInHandler();
            expect(requireAuthenticationStub).toHaveBeenCalled();
        });
    });
});
