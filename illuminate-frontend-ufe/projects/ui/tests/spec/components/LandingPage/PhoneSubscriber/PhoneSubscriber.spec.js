/* eslint-disable object-curly-newline */
const React = require('react');
const { mount } = require('enzyme'); // using mount, since we need to test children behavior
const PhoneSubscriber = require('components/LandingPage/PhoneSubscriber/PhoneSubscriber').default;

describe('PhoneSubscriber Controller', () => {
    let wrapper;
    let component;
    let smsSubscribeStub;
    let urlUtilsStub;

    const notifications = require('services/api/notifications').default;
    const localeUtils = require('utils/LanguageLocale').default;
    const getTextPhoneSubscriber = localeUtils.getLocaleResourceFile('components/LandingPage/PhoneSubscriber/locales', 'PhoneSubscriber');
    const getTextSMSConfirmationModal = localeUtils.getLocaleResourceFile(
        'components/LandingPage/PhoneSubscriber/SMSConfirmationModal/locales',
        'SMSConfirmationModal'
    );
    const urlUtils = require('utils/Url').default;
    const mobileInput = 'input#mobilePhone';
    const mockPhoneNumber = '5141235678';

    beforeEach(() => {
        wrapper = mount(<PhoneSubscriber />);
        component = wrapper.instance();

        const fakePromise = {
            then: () => fakePromise,
            catch: () => {}
        };
        smsSubscribeStub = spyOn(notifications, 'smsSubscribe').and.returnValue(fakePromise);
        urlUtilsStub = spyOn(urlUtils, 'redirectTo').and.callFake(() => {});
    });

    it('should be a Component', () => {
        expect(component instanceof React.Component).toBe(true);
    });

    it('should have an input field for mobile number input', () => {
        expect(wrapper.find(mobileInput)).toBeTruthy();
    });

    it('should display an error for an empty phone number', () => {
        // arrange / act
        wrapper.find(mobileInput).simulate('change', { target: { value: '' } });
        wrapper.find('button').simulate('click');
        const invalidMsg = wrapper.find('p[role="alert"]');

        // assert
        expect(invalidMsg.exists()).toBe(true);
        expect(invalidMsg.text()).toBe(getTextPhoneSubscriber('mobilePhoneEmptyError'));
    });

    it('should display an error for an invalid phone number', () => {
        wrapper.find(mobileInput).simulate('change', { target: { value: '000' } });
        wrapper.find('button').simulate('click');

        const invalidMsg = wrapper.find('p[role="alert"]');

        expect(invalidMsg.exists()).toBe(true);
        expect(invalidMsg.text()).toBe(getTextPhoneSubscriber('mobilePhoneInvalidError'));
    });

    it('should format the phone number properly (getHiddenPhoneNumber)', () => {
        const MAX_VISIBLE_PHONE_DIGITS = 3;
        wrapper.setState({ phoneNumber: mockPhoneNumber });
        const maskedPhoneNumber = component.getHiddenPhoneNumber();
        // prettier-ignore
        const expectedMaskedPhoneNumber = `••• ••• •${mockPhoneNumber.substr(mockPhoneNumber.length - MAX_VISIBLE_PHONE_DIGITS)}`;

        expect(maskedPhoneNumber).toEqual(expectedMaskedPhoneNumber);
    });

    it('should call services/api/notifications/smsSubscribe on valid phone number', () => {
        // Arrange
        component = new PhoneSubscriber({});
        component.isValid = () => true;
        component.state = { phoneNumber: mockPhoneNumber };
        smsSubscribeStub.and.returnValue({ then: () => ({ catch: () => {} }) });

        // Act
        component.subscribeUser();

        // Assert
        expect(smsSubscribeStub).toHaveBeenCalledWith(mockPhoneNumber);
    });

    it('should display subscribeUser error (showServerErrorMessage)', () => {
        wrapper.setState({ showServerErrorMessage: true });

        const errorMsg = wrapper.find('div[role="alert"]');

        expect(errorMsg.exists()).toBe(true);
        expect(errorMsg.text()).toBe(getTextPhoneSubscriber('serverErrorMessage'));
    });

    it('should display SMSConfirmationModal', () => {
        wrapper.setState({
            phoneNumber: mockPhoneNumber,
            isModalOpen: true
        });

        const modal = wrapper.find('Modal');
        expect(modal.props().isOpen).toEqual(true);

        const modalTitle = wrapper.find('ModalTitle[data-at="sms_confirmation_title"]');
        expect(modalTitle.text()).toBe(getTextSMSConfirmationModal('modalTitle'));
    });

    it('should be able to close SMSConfirmationModal', () => {
        wrapper.setState({
            phoneNumber: mockPhoneNumber,
            isModalOpen: true
        });
        component.closeModal();
        wrapper.update();

        const modal = wrapper.find('Modal');
        expect(modal.props().isOpen).toEqual(false);
        expect(component.state.phoneNumber).toEqual('');
        expect(wrapper.find('ModalTitle').exists()).toBeFalse();
    });

    it('should be able to continue shopping by closing modal and redirecting to the root of the site', () => {
        component.continueShopping();
        wrapper.update();

        expect(component.state.phoneNumber).toEqual('');
        expect(component.state.isModalOpen).toEqual(false);
        expect(urlUtilsStub).toHaveBeenCalledWith('/');
    });
});
