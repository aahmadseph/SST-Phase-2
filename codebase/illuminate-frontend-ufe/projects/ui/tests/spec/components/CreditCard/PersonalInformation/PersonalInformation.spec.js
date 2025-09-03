/* eslint-disable object-curly-newline */
const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('PersonalInformation component', () => {
    let PersonalInformation;
    let ErrorConstants;
    let inputName;
    let component;

    beforeEach(() => {
        PersonalInformation = require('components/CreditCard/ApplyFlow/PersonalInformation/PersonalInformation').default;
        ErrorConstants = require('utils/ErrorConstants').default;

        const wrapper = shallow(<PersonalInformation />);
        component = wrapper.instance();
    });

    describe('getErrorCode method', () => {
        it('should return the mobile error code', () => {
            inputName = 'mobilePhone';
            expect(component.getErrorCode(inputName)).toBe(ErrorConstants.ERROR_CODES.MOBILE_NUMBER);
        });

        it('should return the alternate error code', () => {
            inputName = 'alternatePhone';
            expect(component.getErrorCode(inputName)).toBe(ErrorConstants.ERROR_CODES.ALTERNATIVE_NUMBER);
        });
    });

    describe('getInputValue method', () => {
        let value;

        beforeEach(() => {
            inputName = 'mobilePhone';
            value = '(555)-555-5555';

            component.mobilePhone = {
                getValue: createSpy('getValue').and.returnValue(value)
            };
        });

        it('should return the value of the ref that matches inputName', () => {
            expect(component.getInputValue(inputName)).toBe(value);
        });
    });

    describe('formatPhoneNumber method', () => {
        let e;
        let name;
        let setStateStub;

        beforeEach(() => {
            e = {
                target: {
                    value: '',
                    name: 'mobilePhone'
                },
                inputType: ''
            };
            name = e.target.name;
            setStateStub = spyOn(component, 'setState');
        });

        it('should format phone number to 1', () => {
            e.target.value = '1';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledWith({
                [name]: ''
            });
        });

        it('should format phone number to (123)4', () => {
            e.target.value = '1234';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledWith({
                [name]: '(123) 4'
            });
        });

        it('should format phone number to (123) 456-7', () => {
            e.target.value = '1234567';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledWith({
                [name]: '(123) 456-7'
            });
        });

        it('should remove hyphen from phone number to (123) 456', () => {
            e.target.value = '123456';
            e.target.inputType = 'deleteContentBackward';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledWith({
                [name]: '(123) 456'
            });
        });

        it('should call the removeSpecificError method with correct error code', () => {
            const pairedInput = component.getPairedInputName(name);
            const errorCode = component.getErrorCode(pairedInput);

            component[pairedInput] = {
                removeSpecificError: createSpy('removeSpecificError')
            };

            component.formatPhoneNumber(e);
            expect(component[pairedInput].removeSpecificError).toHaveBeenCalledWith(ErrorConstants.ERRORS[errorCode].message);
        });
    });

    describe('validateForm method', () => {
        let ErrorUtils;
        let collectClientFieldErrorsStub;
        let validateStub;

        beforeEach(() => {
            component.emailInput = {};
            component.mobilePhone = {};
            component.alternatePhone = {};
            component.addressForm = {
                validateForm: createSpy('validateForm')
            };

            ErrorUtils = require('utils/Errors').default;
            collectClientFieldErrorsStub = spyOn(ErrorUtils, 'collectClientFieldErrors');
            validateStub = spyOn(ErrorUtils, 'validate');

            component.validateForm();
        });

        it('should call collectClientFieldErrors with correct fields', () => {
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith([component.emailInput, component.mobilePhone, component.alternatePhone]);
        });

        it('should call ErrorUtils.validate once', () => {
            expect(validateStub).toHaveBeenCalledTimes(1);
        });

        it('should call this.addressForm.validateForm once', () => {
            expect(component.addressForm.validateForm).toHaveBeenCalledTimes(1);
            expect(component.addressForm.validateForm).toHaveBeenCalledWith(true);
        });
    });

    describe('getData method', () => {
        let getDataStub;

        beforeEach(() => {
            component.emailInput = {
                getValue: function () {
                    return 'email';
                }
            };
            component.mobilePhone = {};
            component.alternatePhone = {};
            component.addressForm = {
                getData: function () {
                    return {
                        address: {
                            firstName: 'first',
                            lastName: 'last',
                            addressData: 'addressData'
                        }
                    };
                }
            };
            component.state = {
                mobilePhone: '(123)-123-1234',
                alternatePhone: '(999)-000-9999'
            };
        });

        it('should call getData with correct fields', () => {
            getDataStub = component.getData();
            expect(getDataStub).toEqual({
                firstName: 'first',
                lastName: 'last',
                address: { addressData: 'addressData' },
                email: 'email',
                mobilePhone: '1231231234',
                alternatePhone: '9990009999'
            });
        });
    });
});
