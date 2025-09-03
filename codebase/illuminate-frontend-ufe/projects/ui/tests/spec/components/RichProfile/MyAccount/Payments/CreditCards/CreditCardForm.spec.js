const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('CreditCardForm component', () => {
    let CreditCardForm;
    let OrderUtils;
    let event;
    let props;
    let component;

    beforeEach(() => {
        OrderUtils = require('utils/Order').default;
        CreditCardForm = require('components/RichProfile/MyAccount/Payments/CreditCards/CreditCardForm/CreditCardForm').default;

        event = { preventDefault: createSpy() };

        props = {
            userProfileId: '7034060531',
            creditCard: { creditCardId: 'usercc1820008' },
            successCallback: createSpy('successCallback')
        };
    });

    describe('credit card form validation', () => {
        let createCreditCardStub;
        let setStateStub;
        let addressForm;
        let validateAddressStub;
        let formValidator;
        let getErrorsStub;
        beforeEach(() => {
            formValidator = require('utils/FormValidator').default;
            getErrorsStub = spyOn(formValidator, 'getErrors');
            getErrorsStub.and.returnValue({ errors: {} });
        });

        describe('validation of card in edit mode', () => {
            beforeEach(() => {
                props.isEditMode = true;
                props.creditCard = {
                    address: {
                        firstName: 'firstName',
                        lastName: 'lastName',
                        address1: 'address1',
                        city: 'city',
                        state: 'state',
                        postalCode: 'postalCode',
                        country: 'country',
                        phoneNumber: 'phoneNumber'
                    },
                    cardNumber: '',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    isDefault: false
                };
                const wrapper = shallow(<CreditCardForm {...props} />);
                component = wrapper.instance();
                component.addressForm = { validateForm: function () {} };
                addressForm = component.addressForm;
                validateAddressStub = spyOn(addressForm, 'validateForm').and.returnValue(true);
                setStateStub = spyOn(component, 'setState');
                createCreditCardStub = spyOn(component, 'createOrUpdateCreditCard');
            });

            // Validation will always run for security code field so getErrorsStub should always be called once
            it('should not validate card number field but validates cvc', () => {
                component.state.expMonth = 4;
                component.state.expYear = 2050;
                component.state.securityCode = '111';
                component.securityCodeInput = '111';
                component.validateCreditCardForm(event);

                expect(getErrorsStub).toHaveBeenCalledTimes(1);
            });

            it('should not throw error if expiration month and year are selected, security code is filled', () => {
                component.props.creditCard.cardType = 'visa';
                component.cardNumberInput = '4111111111111111';
                component.state.expMonth = 4;
                component.state.expYear = 2050;
                component.securityCodeInput = '111';
                component.validateCreditCardForm(event);

                expect(getErrorsStub).toHaveBeenCalledTimes(1);
            });

            it('should throw error if no expiration month is selected', () => {
                component.props.creditCard.cardType = 'visa';
                component.state.expMonth = null;
                component.state.expYear = 2050;
                component.securityCodeInput = '111';
                component.validateCreditCardForm(event);

                expect(getErrorsStub).toHaveBeenCalled();
            });

            it('should throw error if no expiration year is selected', () => {
                component.props.creditCard.cardType = 'visa';
                component.state.expMonth = 10;
                component.state.expYear = null;
                component.securityCodeInput = '111';
                component.validateCreditCardForm(event);

                expect(getErrorsStub).toHaveBeenCalled();
            });

            it('should throw error if CVC/CVV field is empty', () => {
                component.props.creditCard.cardType = 'visa';
                component.state.expMonth = 12;
                component.state.expYear = 2050;
                component.securityCodeInput = null;
                component.validateCreditCardForm(event);

                expect(getErrorsStub).toHaveBeenCalled();
            });

            it('should throw error if CVC/CVV field length is invalid', () => {
                component.props.creditCard.cardType = 'visa';
                component.state.expMonth = 12;
                component.state.expYear = 2050;
                component.securityCodeInput = '11';
                component.validateCreditCardForm(event);

                expect(getErrorsStub).toHaveBeenCalled();
            });
        });

        describe('validation of new card', () => {
            beforeEach(() => {
                props.isEditMode = false;
                const wrapper = shallow(<CreditCardForm {...props} />);
                component = wrapper.instance();
                component.addressForm = { validateForm: function () {} };
                addressForm = component.addressForm;
                validateAddressStub = spyOn(addressForm, 'validateForm');
                setStateStub = spyOn(component, 'setState');
                createCreditCardStub = spyOn(component, 'createOrUpdateCreditCard');
            });

            it('should not call function to create credit card if card number field is empty', () => {
                component.cardNumberInput = '';
                validateAddressStub.and.returnValue(true);
                component.validateCreditCardForm(event);

                expect(createCreditCardStub).not.toHaveBeenCalled();
            });

            it('should call setState if no card type has been selected', () => {
                component.state.cardType = '';
                validateAddressStub.and.returnValue(true);
                component.validateCreditCardForm(event);

                expect(setStateStub).toHaveBeenCalledTimes(2);
                expect(createCreditCardStub).not.toHaveBeenCalled();
            });

            it('should validate expiration month and year', () => {
                component.state.cardType = 'visa';
                validateAddressStub.and.returnValue(true);
                component.validateCreditCardForm(event);

                expect(setStateStub).toHaveBeenCalledTimes(2);
                expect(createCreditCardStub).not.toHaveBeenCalled();
            });

            it('should call function to create credit card if all mandatory fields are valid', () => {
                component.state.cardType = 'visa';
                component.cardNumberInput = '4111111111111111';
                component.state.expMonth = 4;
                component.state.expYear = 2050;
                component.state.securityCode = 333;

                validateAddressStub.and.returnValue(true);
                component.validateCreditCardForm(event);
                getErrorsStub.and.returnValue({});

                expect(createCreditCardStub).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('onCountryChange', () => {
        let setStateStub;

        describe('when isEditMode is set to true', () => {
            beforeEach(() => {
                props = {
                    creditCard: { creditCardId: 'usercc1820008' },
                    isEditMode: true
                };
                const wrapper = shallow(<CreditCardForm {...props} />);
                component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
                component.onCountryChange('US');
            });

            it('should update state for selectedCountry', () => {
                expect(setStateStub).toHaveBeenCalledWith({ selectedCountry: 'US' });
            });
        });

        describe('when country selected is US', () => {
            beforeEach(() => {
                props = { isEditMode: false };
                const wrapper = shallow(<CreditCardForm {...props} />);
                component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
                component.onCountryChange('US');
            });

            it('should update state for selectedCountry', () => {
                expect(setStateStub).toHaveBeenCalledWith({ selectedCountry: 'US' });
            });
        });

        describe('when cardType === discover', () => {
            beforeEach(() => {
                props = { isEditMode: false };
                const wrapper = shallow(<CreditCardForm {...props} />);
                component = wrapper.instance();
                component.state = { cardType: 'discover' };
                setStateStub = spyOn(component, 'setState');
                component.onCountryChange('CA');
            });

            it('should update state for selectedCountry and clear out card info', () => {
                expect(setStateStub).toHaveBeenCalledWith({
                    cardType: '',
                    expYear: '',
                    expMonth: '',
                    securityCode: '',
                    cardNumber: '',
                    selectedCountry: 'CA'
                });
            });
        });
    });

    describe('handling the cart type dropdown', () => {
        beforeEach(() => {
            Sephora.fantasticPlasticConfigurations.isGlobalEnabled = true;
            component = new CreditCardForm({});
            component.state.canSephoraCardBeDefault = true;
        });

        describe('when is a non-Sephora card', () => {
            it('should set the state appropriately', () => {
                // Arrange
                component.cardTypeSelect = { setValue: () => {} };
                const setStateStub = spyOn(component, 'setState');
                const newState = {
                    cardType: OrderUtils.CREDIT_CARD_TYPES.DISCOVER.name,
                    emptyCardType: false,
                    cardTypeInvalid: false,
                    isDefault: false
                };

                // Act
                component.handleCardTypeSelect({ target: { value: newState.cardType } });

                // Assert
                expect(setStateStub).toHaveBeenCalledWith(newState);
            });

            it('should set the dropdown value properly', () => {
                // Arrange
                component.cardTypeSelect = { setValue: createSpy('setValue') };
                spyOn(component, 'setState');
                const cardType = OrderUtils.CREDIT_CARD_TYPES.DISCOVER.name;

                component.handleCardTypeSelect({ target: { value: cardType } });
                // Act

                // Assert
                expect(component.cardTypeSelect.setValue).toHaveBeenCalledWith(cardType);
            });
        });

        describe('when is a Sephora card', () => {
            it('should set the state appropriately', () => {
                // Arrange
                component.cardTypeSelect = { setValue: () => {} };
                const setStateStub = spyOn(component, 'setState');
                const newState = {
                    cardType: OrderUtils.CREDIT_CARD_TYPES.SEPHORA.name,
                    emptyCardType: false,
                    cardTypeInvalid: false,
                    isDefault: true
                };

                // Act
                component.handleCardTypeSelect({ target: { value: newState.cardType } });

                // Assert
                expect(setStateStub).toHaveBeenCalledWith(newState);
            });

            it('should set the dropdown value properly', () => {
                // Arrange
                component.cardTypeSelect = { setValue: createSpy('setValue') };
                spyOn(component, 'setState');
                const cardType = OrderUtils.CREDIT_CARD_TYPES.SEPHORA.name;

                component.handleCardTypeSelect({ target: { value: cardType } });
                // Act

                // Assert
                expect(component.cardTypeSelect.setValue).toHaveBeenCalledWith(cardType);
            });
        });
    });
});
