const { any } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

describe('SignInFormNew component', () => {
    let SignInFormNew;
    let shallowComponent;

    beforeEach(() => {
        SignInFormNew = require('components/GlobalModals/SignInModal/SignInFormNew/SignInFormNew').default;
    });

    describe('General default form', () => {
        beforeEach(() => {
            shallowComponent = shallow(<SignInFormNew />, { disableLifecycleMethods: true });
        });

        it('should render an email input field component', () => {
            const EmailComp = shallowComponent.find('InputEmail');
            expect(EmailComp.length).toBe(1);
        });

        it('should render a password input field component', () => {
            const passwordRevealInputWithForwardRefWrapper = shallowComponent.find('PasswordRevealInputWithForwardRef');
            expect(passwordRevealInputWithForwardRefWrapper.exists()).toBe(true);
        });

        it('should render a password input field component', () => {
            const passwordRevealInputWithForwardRefWrapper = shallowComponent.find('PasswordRevealInputWithForwardRef');
            expect(passwordRevealInputWithForwardRefWrapper.props().onChange).toEqual(any(Function));
        });

        it('should render the correct submit button', () => {
            const SubmitComp = shallowComponent.find('Button[type="submit"]');
            expect(SubmitComp.exists()).toBe(true);
        });
    });
});
