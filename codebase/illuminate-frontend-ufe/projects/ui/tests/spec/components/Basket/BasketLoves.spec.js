const React = require('react');
const { shallow } = require('enzyme');

const auth = require('utils/Authentication').default;
const userUtils = require('utils/User').default;
const BasketLoves = require('components/Loves/BasketLoves/BasketLoves').default;

describe('BasketLoves component', () => {
    let wrapper;
    let component;
    let event;
    let stopPropagationStub;
    let requireAuthenticationStub;
    let props = {};

    beforeEach(() => {
        requireAuthenticationStub = spyOn(auth, 'requireAuthentication').and.returnValue({ catch: () => {} });
    });

    describe('initalization of non anonymous user', () => {
        beforeEach(() => {
            props = { auth: { profileStatus: userUtils.PROFILE_STATUS.LOGGED_IN } };
            wrapper = shallow(<BasketLoves {...props} />);
            component = wrapper.instance();
        });

        it('should set isLoggedIn state to true when user is not anonymous', () => {
            expect(component.state.isLoggedIn).toBe(true);
        });
    });

    describe('initalization of anonymous user', () => {
        beforeEach(() => {
            props = { auth: { profileStatus: userUtils.PROFILE_STATUS.ANONYMOUS } };
            wrapper = shallow(<BasketLoves {...props} />);
            component = wrapper.instance();
        });

        it('should set isLoggedIn state to false when user is anonymous', () => {
            expect(component.state.isLoggedIn).toBe(false);
        });
    });

    describe('Basket Loves not signed', () => {
        beforeEach(() => {
            event = { stopPropagation: function () {} };
            stopPropagationStub = spyOn(event, 'stopPropagation');
            wrapper = shallow(<BasketLoves />);
            component = wrapper.instance();
            component.signInHandler(event);
        });

        it('should stop stop propagation', () => {
            expect(stopPropagationStub).toHaveBeenCalled();
        });

        it('should open sign in modal', () => {
            expect(requireAuthenticationStub).toHaveBeenCalled();
        });
    });
});
