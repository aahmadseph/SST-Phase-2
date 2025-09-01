const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('SecureInformation component', () => {
    let SecureInformation;
    let component;

    beforeEach(() => {
        SecureInformation = require('components/CreditCard/ApplyFlow/SecureInformation/SecureInformation').default;

        const wrapper = shallow(<SecureInformation />);
        component = wrapper.instance();
    });

    describe('Format Annual Income', () => {
        let e;
        let setStateStub;

        beforeEach(() => {
            e = {
                target: { value: '' },
                inputType: ''
            };

            setStateStub = spyOn(component, 'setState');
        });

        it('should remove the first 0 from annual income', () => {
            e.target.value = '$012,300';
            e.target.inputType = null;
            component.formatAnnualIncome(e);
            expect(setStateStub).toHaveBeenCalledWith({ annualIncome: '$12,300' });
        });

        it('should add a comma to annual income', () => {
            e.target.value = '$4300';
            component.formatAnnualIncome(e);
            expect(setStateStub).toHaveBeenCalledWith({ annualIncome: '$4,300' });
        });

        it('should add two commas to annual income', () => {
            e.target.value = '$4000,300';
            component.formatAnnualIncome(e);
            expect(setStateStub).toHaveBeenCalledWith({ annualIncome: '$4,000,300' });
        });

        it('should add a dollar sign to annual income', () => {
            e.target.value = '5';
            component.formatAnnualIncome(e);
            expect(setStateStub).toHaveBeenCalledWith({ annualIncome: '$5' });
        });
    });

    describe('Validate Form', () => {
        let ErrorsUtils;
        let collectClientFieldErrorsStub;
        let validateStub;

        beforeEach(() => {
            ErrorsUtils = require('utils/Errors').default;
            collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors');
            validateStub = spyOn(ErrorsUtils, 'validate');

            component.socialSecurityInput = {};
            component.annualIncomeInput = {};
            component.birthdayForm = { validateForm: createSpy('validateForm') };

            component.validateForm();
        });

        it('should call collectClientFieldErrors with correct fields', () => {
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith([
                component.birthdayForm,
                component.socialSecurityInput,
                component.annualIncomeInput
            ]);
        });

        it('should call this.birthdayForm.validateForm once', () => {
            expect(component.birthdayForm.validateForm).toHaveBeenCalledTimes(1);
        });

        it('should call ErrorsUtils.validateForm once', () => {
            expect(validateStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('Get Data', () => {
        let getDataStub;

        beforeEach(() => {
            component.socialSecurityInput = { getValue: () => '1234' };
            component.annualIncomeInput = { getValue: () => '$120,000,000' };
            component.birthdayForm = { getBirthday: () => '1992/10/30' };
        });

        it('should get the correct data from the form', () => {
            getDataStub = component.getData();
            expect(getDataStub).toEqual({
                birthday: '1992/10/30',
                socialSecurity: '1234',
                annualIncome: '120000000'
            });
        });
    });
});
