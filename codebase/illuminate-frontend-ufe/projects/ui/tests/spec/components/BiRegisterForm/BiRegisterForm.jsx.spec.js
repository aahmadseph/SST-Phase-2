const { shallow } = enzyme;

describe('BiRegisterForm component', () => {
    let React;
    let BiRegisterForm;
    let shallowedComponent;

    beforeEach(() => {
        React = require('react');
        BiRegisterForm = require('components/BiRegisterForm/BiRegisterForm').default;
        shallowedComponent = shallow(<BiRegisterForm />);
    });

    it('should render beauty insider image if it is not on register modal', () => {
        expect(shallowedComponent.find({ alt: 'Beauty Insider' }).length).toBe(1);
    });

    it('should display bi account required text if isCreditCardApply is true', () => {
        shallowedComponent = shallow(<BiRegisterForm isCreditCardApply={true} />);
        const biAccountRequiredText = shallowedComponent.find('Text').at(0);
        expect(biAccountRequiredText.prop('children')).toBe('A Beauty Insider account is required to apply for the Sephora Credit Card.');
    });

    it('should display auto birthday enroll message if isOrderConfirmation and showBirthdayForAutoEnrolled are true', () => {
        shallowedComponent = shallow(
            <BiRegisterForm
                isOrderConfirmation={true}
                showBirthdayForAutoEnrolled={true}
            />
        );
        const showBirthdayForAutoEnrolledText = shallowedComponent.find('Text').at(0);
        expect(showBirthdayForAutoEnrolledText.prop('children')).toBe(
            'Add your birthday below to receive a free gift during your birthday month—it’s just one of the many perks of Beauty Insider.'
        );
    });

    it('should display not birthday enroll message if isOrderConfirmation is true and showBirthdayForAutoEnrolled is false', () => {
        shallowedComponent = shallow(
            <BiRegisterForm
                isOrderConfirmation={true}
                showBirthdayForAutoEnrolled={false}
            />
        );
        const showBirthdayForAutoEnrolledText = shallowedComponent.find('Text').at(0);
        expect(showBirthdayForAutoEnrolledText.prop('children')).toBe(
            'Sign up for our free rewards program to earn points with every purchase, a gift on your birthday, one-of-a-kind experiences, services, and samples.'
        );
    });

    it('should display sign up points if showBirthdayForAutoEnrolled is false and signUpPoint are > 0', () => {
        shallowedComponent = shallow(
            <BiRegisterForm
                showBirthdayForAutoEnrolled={false}
                signUpPoints={5}
            />
        );
        const signUpText = shallowedComponent.find('Text').at(0);
        expect(signUpText.length).toBe(1);
    });

    it('should display error message if has error and isApplePaySignIn is true', () => {
        const applePayError = 'Error ApplePay';
        shallowedComponent = shallow(<BiRegisterForm isApplePaySignIn={true} />);
        shallowedComponent.setState({ biFormError: applePayError });
        expect(shallowedComponent.find('ErrorMsg').prop('children')).toBe(applePayError);
    });

    it('should not display checkbox if hasJoinBICheckbox is false', () => {
        shallowedComponent = shallow(
            <BiRegisterForm
                displayBirthdayForAutoEnrolled={true}
                isStoreUser={true}
                isGuestCheckout={true}
                isRegisterModal={true}
            />
        );
        expect(shallowedComponent.find({ name: 'join_bi' }).length).toBe(0);
    });

    it('should display checkbox if hasJoinBICheckbox is true', () => {
        shallowedComponent = shallow(
            <BiRegisterForm
                displayBirthdayForAutoEnrolled={false}
                isStoreUser={false}
                isGuestCheckout={false}
                isRegisterModal={false}
            />
        );
        expect(shallowedComponent.find({ name: 'join_bi' }).length).toBe(1);
    });

    it('should display error message if bi registraction checkbox is not checked and isGuestCheckout is  true', () => {
        const errorRegistrationMessage = 'Error Registration';
        shallowedComponent = shallow(
            <BiRegisterForm
                isGuestCheckout={true}
                uncheckJoinErrorMsg={errorRegistrationMessage}
            />
        );
        shallowedComponent.setState({ isJoinBIChecked: false });
        expect(shallowedComponent.find('ErrorMsg').prop('children')).toBe(errorRegistrationMessage);
    });

    it('should display unchecking message if isApplePaySignIn and isBIAutoEnroll are true', () => {
        shallowedComponent = shallow(
            <BiRegisterForm
                isApplePaySignIn={true}
                isBIAutoEnroll={true}
            />
        );
        expect(shallowedComponent.find('Text').prop('children')).toBe('By unchecking the box above, you are registering for Sephora.com only.');
    });

    it('should display joining text if isApplePaySignIn or isBIAutoEnroll are false', () => {
        shallowedComponent = shallow(
            <BiRegisterForm
                isApplePaySignIn={true}
                isBIAutoEnroll={false}
            />
        );
        expect(shallowedComponent.find('Text').at(0).prop('children')[0]).toBe(
            'By clicking “Join Now” you acknowledge that you are a U.S. or Canada resident and (1) have read Sephora’s'
        );
    });

    it('should render birthday form if isBIAutoEnroll is false', () => {
        shallowedComponent = shallow(<BiRegisterForm isBIAutoEnroll={false} />);
        expect(shallowedComponent.find('BiBirthdayForm').length).toBe(1);
    });

    it('should render data-at attribute for terms link', () => {
        shallowedComponent = shallow(<BiRegisterForm />);
        expect(shallowedComponent.find('Link').at(2).prop('data-at')).toEqual('terms_conditions_link');
    });

    it('should render data-at attribute for terms checkbox', () => {
        shallowedComponent = shallow(<BiRegisterForm />);
        expect(shallowedComponent.find('Checkbox > b').prop('data-at')).toEqual('become_bi_check_box');
    });
});
