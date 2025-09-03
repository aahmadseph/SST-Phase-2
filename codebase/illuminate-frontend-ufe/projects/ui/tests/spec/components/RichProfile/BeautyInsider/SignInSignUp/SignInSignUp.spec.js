const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('SignInSignUp', () => {
    let store;
    let actions;
    let preventDefaultStub;
    let auth;
    let dispatchStub;
    let requireAuthenticationStub;
    let showRegisterModalStub;
    let component;
    let wrapper;
    let event;
    let SignInSignUp;

    beforeEach(() => {
        store = require('store/Store').default;
        actions = require('Actions').default;

        dispatchStub = spyOn(store, 'dispatch');
        SignInSignUp = require('components/RichProfile/BeautyInsider/SignInSignUp/SignInSignUp').default;

        preventDefaultStub = jasmine.createSpy();
        event = { preventDefault: preventDefaultStub };
        wrapper = shallow(<SignInSignUp />);
        component = wrapper.instance();
    });

    describe('trigger signIn', () => {
        beforeEach(() => {
            auth = require('utils/Authentication').default;
            requireAuthenticationStub = spyOn(auth, 'requireAuthentication').and.returnValue({ catch: () => {} });
            component.signIn(event);
        });

        it('should call preventDefault', () => {
            expect(preventDefaultStub).toHaveBeenCalled();
        });

        it('should call requireAuthentication', () => {
            expect(requireAuthenticationStub).toHaveBeenCalled();
        });
    });

    describe('trigger register', () => {
        beforeEach(() => {
            showRegisterModalStub = spyOn(actions, 'showRegisterModal');
            component.register(event);
        });

        it('should call preventDefault', () => {
            expect(preventDefaultStub).toHaveBeenCalled();
        });

        it('should call dispatch', () => {
            expect(dispatchStub).toHaveBeenCalled();
        });

        it('should call showRegisterModal', () => {
            expect(showRegisterModalStub).toHaveBeenCalledWith({ isOpen: true, openPostBiSignUpModal: true });
        });
    });
});
