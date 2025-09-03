const React = require('react');
const { shallow, mount } = require('enzyme');
const BrandLaunchLogin = require('components/Brand/BrandLaunch/BrandLaunchLogin/BrandLaunchLogin').default;

describe('BrandLaunchLogin component', () => {
    let wrapper;

    beforeEach(() => {
        const props = {
            user: {},
            lead: 'Selfless by Hyram',
            stepOne: '1. Sign In',
            stepTwo: '2. Enter Your Mobile Phone Number',
            createAccount: 'Create an Account',
            forgotPassword: 'Forgot password',
            buttonSendAlerts: 'Send Me Sephora Text Alerts'
        };

        wrapper = enzyme.shallow(<BrandLaunchLogin {...props} />);
    });

    it('should render component', () => {
        shallow(<BrandLaunchLogin />);
    });
    it('should render the correct Title', () => {
        const text = wrapper.find('Text').get(0);
        expect(text.props.children).toBe('Selfless by Hyram');
    });
    it('should render the first step subtitle', () => {
        const text = wrapper.find('Text').get(1);
        expect(text.props.children).toBe('1. Sign In');
    });
    it('should render the second step subtitle', () => {
        const text = wrapper.find('Text').get(3);
        expect(text.props.children).toBe('2. Enter Your Mobile Phone Number');
    });
    it('should render create account link', () => {
        const text = wrapper.find('Link').get(0);
        expect(text.props.children).toBe('Create an Account');
    });
    it('should render forgot password link', () => {
        const linkForgot = wrapper.find('Link').get(1);
        expect(linkForgot.props.children).toBe('Forgot password');
    });
});

describe('General default form', () => {
    let wrapper;

    beforeEach(() => {
        const props = {
            user: {},
            emailAddressLabel: 'Email Address'
        };

        wrapper = enzyme.shallow(<BrandLaunchLogin {...props} />);
    });
    it('should render a email input', () => {
        const emailInput = wrapper.find('InputEmail').get(0);
        expect(emailInput.props.name).toBe('username');
    });
    it('should render a email input', () => {
        const emailInput = wrapper.find('InputEmail').get(0);
        expect(emailInput.props.label).toBe('Email Address');
    });
    it('should render a password input field component', () => {
        const PasswordComp = wrapper.findWhere(n => n.prop('type') === 'password');
        expect(PasswordComp.length).toBe(1);
    });
    it('should render a password input field component', () => {
        const PasswordComp = wrapper.findWhere(n => n.prop('type') === 'password');
        expect(typeof PasswordComp.props().onChange).toEqual('function');
    });
    it('should render a submit button', () => {
        const submitButton = wrapper.find('Button');
        expect(submitButton.length).toBe(1);
    });
});

describe('isValid method', () => {
    let formValidator;
    let getErrorsStub;
    let component;

    beforeEach(() => {
        formValidator = require('utils/FormValidator').default;
        getErrorsStub = spyOn(formValidator, 'getErrors');
        const wrapper = shallow(<BrandLaunchLogin />);
        component = wrapper.instance();
        component.isValid();
    });

    it('should not throw error if value is valid', () => {
        expect(getErrorsStub).not.toHaveBeenCalled();
    });
});

describe('isValidPhoneOnly method', () => {
    let formValidator;
    let getErrorsStub;
    let component;

    beforeEach(() => {
        formValidator = require('utils/FormValidator').default;
        getErrorsStub = spyOn(formValidator, 'getErrors');
        const wrapper = shallow(<BrandLaunchLogin />);
        component = wrapper.instance();
        component.isValidPhoneOnly();
    });

    it('should not throw error if phone provided is valid', () => {
        expect(getErrorsStub).not.toHaveBeenCalled();
    });
});

describe('ValidatePhone method', () => {
    let wrapper;
    let component;

    beforeEach(() => {
        const props = {
            enterMobileErrorMessage: 'Please enter a valid mobile phone number.'
        };
        wrapper = mount(<BrandLaunchLogin {...props} />);
        component = wrapper.instance();
    });

    it('should display an error for an invalid phone number', () => {
        const mockPhoneNumber = '813';
        const wrongPhoneNumber = component.validatePhone(mockPhoneNumber);
        expect(wrongPhoneNumber).toEqual('Please enter a valid mobile phone number.');
    });
    it('should display an error when no mobile phone number provided', () => {
        const emptyPhoneNumber = ' ';
        const wrongPhoneNumber = component.validatePhone(emptyPhoneNumber);
        expect(wrongPhoneNumber).toEqual('Please enter a valid mobile phone number.');
    });
});

describe('getHiddenPhoneNumber method', () => {
    let wrapper;
    let component;
    const mockPhoneNumber = '8131235324';

    beforeEach(() => {
        wrapper = mount(<BrandLaunchLogin />);
        component = wrapper.instance();
    });
    it('should format the phone number properly', () => {
        const MAX_VISIBLE_PHONE_DIGITS = 3;
        wrapper.setState({ mobile: mockPhoneNumber });
        const maskedPhoneNumber = component.getHiddenPhoneNumber();
        // prettier-ignore
        const expectedMaskedPhoneNumber = `••• ••• •${mockPhoneNumber.substr(mockPhoneNumber.length - MAX_VISIBLE_PHONE_DIGITS)}`;

        expect(maskedPhoneNumber).toEqual(expectedMaskedPhoneNumber);
    });
});
