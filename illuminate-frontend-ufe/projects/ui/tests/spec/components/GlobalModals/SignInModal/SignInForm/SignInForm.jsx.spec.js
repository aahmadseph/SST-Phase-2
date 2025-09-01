const React = require('react');
const { shallow } = require('enzyme');

describe('SignInForm component', () => {
    let SignInForm;
    let shallowComponent;

    beforeEach(() => {
        SignInForm = require('components/GlobalModals/SignInModal/SignInForm/SignInForm').default;
    });

    describe('General default form', () => {
        beforeEach(() => {
            shallowComponent = shallow(<SignInForm />, { disableLifecycleMethods: true }).setState({ userExists: true });
        });

        it('should render an email input field component', () => {
            const EmailComp = shallowComponent.find('InputEmail');
            expect(EmailComp.length).toBe(1);
        });

        it('should render an email label', () => {
            const EmailLabelComp = shallowComponent.findWhere(n => n.prop('is') === 'label' && n.prop('htmlFor') === 'signin_username');
            expect(EmailLabelComp.length).toBe(1);
        });

        it('should render a password input field component', () => {
            const PasswordComp = shallowComponent.findWhere(n => n.prop('type') === 'password');
            expect(PasswordComp.length).toBe(1);
        });

        it('should render a password label', () => {
            const PasswordLabelComp = shallowComponent.findWhere(n => n.prop('is') === 'label' && n.prop('htmlFor') === 'signin_password');
            expect(PasswordLabelComp.length).toBe(1);
        });

        it('should render a radio button for new users', () => {
            const NewUserRadioComp = shallowComponent.findWhere(n => n.name() === 'Radio' && n.contains('No, I am new to the website'));
            expect(NewUserRadioComp.length).toBe(1);
        });

        it('should render a radio button for existing users', () => {
            const ExistingUserRadioComp = shallowComponent.findWhere(n => n.name() === 'Radio' && n.contains('Yes, I have a password'));
            expect(ExistingUserRadioComp.length).toBe(1);
        });

        it('should hide the password field if the user selects ' + '"No, I am new to the website"', () => {
            let PasswordComp = shallowComponent.findWhere(n => n.prop('type') === 'password');
            expect(PasswordComp.length).toBe(1);
            shallowComponent.setState({ userExists: false });
            PasswordComp = shallowComponent.findWhere(n => n.prop('type') === 'password');
            expect(PasswordComp.length).toBe(0);
        });

        it('should show the password field if the user selects ' + '"Yes, I Have a password"', () => {
            shallowComponent.setState({ userExists: false });
            let PasswordComp = shallowComponent.findWhere(n => n.prop('type') === 'password');
            expect(PasswordComp.length).toBe(0);
            shallowComponent.setState({ userExists: true });
            PasswordComp = shallowComponent.findWhere(n => n.prop('type') === 'password');
            expect(PasswordComp.length).toBe(1);
        });

        it('should render the correct submit button', () => {
            const SubmitComp = shallowComponent.findWhere(n => n.prop('type') === 'submit' && n.contains('Continue'));
            expect(SubmitComp.length).toBe(1);
        });

        it('should not render the radio buttons if user is recognized', () => {
            shallowComponent.setState({ isRecognized: true });
            const RadioComp = shallowComponent.find('Radio');
            expect(RadioComp.length).toBe(0);
        });
    });

    describe('For Sign In With Messaging', () => {
        beforeEach(() => {
            shallowComponent = shallow(<SignInForm isSignInWithMessaging />, { disableLifecycleMethods: true });
        });

        it('should render the correct points in the title', () => {
            shallowComponent.setProps({ potentialBiPoints: 53 });
            expect(shallowComponent.find('Markdown').props().content).toContain('53');
        });

        it('should not render any label', () => {
            const labels = shallowComponent.findWhere(n => n.prop('is') === 'label');
            expect(labels.length).toBe(0);
        });

        it('should render the correct submit button', () => {
            const ButtonComp = shallowComponent.findWhere(n => n.prop('type') === 'submit' && n.contains('Sign In'));
            expect(ButtonComp.length).toBe(1);
        });

        it('should not contain any secondary button', () => {
            const ButtonComp = shallowComponent.findWhere(n => n.name() === 'Button' && n.prop('variant') === 'secondary');
            expect(ButtonComp.length).toBe(0);
        });
    });

    describe('For Apple Pay', () => {
        beforeEach(() => {
            shallowComponent = shallow(<SignInForm isCreditCardApply={false} />, { disableLifecycleMethods: true });
            shallowComponent.setState({ isApplePaySignIn: true });
        });

        it('should render the correct title', () => {
            const title = shallowComponent.find('Text').first().children(0).text();
            const expectedTitle = 'Sign in or create a Sephora account to complete your order with Apple Pay.';
            expect(title).toBe(expectedTitle);
        });

        it('should render the correct submit Button', () => {
            const ButtonComp = shallowComponent.findWhere(n => n.name() === 'Button' && n.prop('type') === 'submit');
            const AppleImage = ButtonComp.find('Image');
            expect(ButtonComp.contains('Buy with')).toBeTruthy();
            expect(AppleImage.length).toBe(1);
        });

        it('should render the Register Form for new users', () => {
            shallowComponent.setState({ userExists: false });
            const RegisterFormComp = shallowComponent.find('RegisterForm');
            expect(RegisterFormComp.length).toBe(1);
        });

        it('should render an Apple Pay disclaimer', () => {
            const expectedDisclaimer = 'Gift cards cannot be combined with Apple Pay.';
            const TextComp = shallowComponent.findWhere(n => n.name() === 'Text' && n.contains(expectedDisclaimer));
            expect(TextComp.length).toBe(1);
        });
    });

    describe('For Mobile Web only', () => {
        let SSIComp;

        beforeEach(() => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            spyOn(Sephora, 'isDesktop').and.returnValue(false);
            shallowComponent = shallow(<SignInForm isSSIEnabled={true} />, { disableLifecycleMethods: true });
            shallowComponent.setState({ userExists: true });
            SSIComp = shallowComponent.find('Checkbox[name="stay_signed_in"]');
        });

        it('should show a Stay Sign In (SSI) Input Switch if enabled', () => {
            expect(SSIComp.length).toBe(1);
        });

        it('should show SSI turned on by default mobile', () => {
            expect(SSIComp.prop('checked')).toBeTruthy();
        });
    });
});
