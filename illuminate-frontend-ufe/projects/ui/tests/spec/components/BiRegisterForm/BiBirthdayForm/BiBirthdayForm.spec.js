const React = require('react');
const { shallow } = enzyme;

describe('BiBirthdayForm component', () => {
    const { any } = jasmine;
    let component;
    let props;
    let BiBirthdayForm;

    beforeEach(() => {
        BiBirthdayForm = require('components/BiRegisterForm/BiBirthdayForm/BiBirthdayForm').default;
    });

    describe('Handle Month Select', () => {
        let setStateStub;
        let e;

        beforeEach(() => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            e = { target: { value: '12' } };
        });

        it('should update state with month info', () => {
            component.handleMonthSelect(e);
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                biMonth: 12,
                monthInvalid: false,
                biFormError: null
            });
        });
    });

    describe('Handle Day Select', () => {
        let setStateStub;
        let e;

        beforeEach(() => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            e = { target: { value: '22' } };
        });

        it('should update state with month info', () => {
            component.handleDaySelect(e);
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                biDay: 22,
                dayInvalid: false,
                biFormError: null
            });
        });
    });

    describe('Handle Year Select', () => {
        let setStateStub;
        let e;

        beforeEach(() => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            e = { target: { value: '2000' } };
        });

        it('should update state with year info', () => {
            component.handleYearSelect(e);
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                biYear: 2000,
                yearInvalid: false,
                biFormError: null
            });
        });
    });

    describe('Getting Birthday Form Data', () => {
        beforeEach(() => {
            props = {
                biData: {
                    bMon: 12,
                    bDay: 20,
                    bYear: 2000
                },
                biFormTestType: 'default'
            };
            const wrapper = shallow(<BiBirthdayForm {...props} />);
            component = wrapper.instance();
        });

        it('should get users birth month', () => {
            expect(component.getMonth()).toEqual('12');
        });

        it('should get users birth day', () => {
            expect(component.getDay()).toEqual('20');
        });

        it('should get users birth year', () => {
            expect(component.getYear()).toEqual(2000);
        });

        it('should get bi form error', () => {
            component.state = { biFormError: 'biFormError' };
            expect(component.getBIFormError()).toEqual('biFormError');
        });

        it('should get birthday object', () => {
            expect(component.getBirthday()).toEqual({
                birthMonth: '12',
                birthDay: '20',
                birthYear: 2000
            });
        });

        it('should get birthday as string', () => {
            expect(component.getBirthday(true)).toEqual('2000/12/20');
        });
    });

    describe('Getting Birthday Form Data', () => {
        beforeEach(() => {
            props = {
                biData: {
                    bMon: 2,
                    bDay: 2,
                    bYear: 2000
                },
                biFormTestType: 'default'
            };
            const wrapper = shallow(<BiBirthdayForm {...props} />);
            component = wrapper.instance();
        });

        it('should get users birth month', () => {
            expect(component.getMonth()).toEqual('2');
        });

        it('should get users birth day', () => {
            expect(component.getDay()).toEqual('2');
        });

        it('should get users birth year', () => {
            expect(component.getYear()).toEqual(2000);
        });

        it('should get bi form error', () => {
            component.state = { biFormError: 'biFormError' };
            expect(component.getBIFormError()).toEqual('biFormError');
        });

        it('should get birthday object', () => {
            expect(component.getBirthday()).toEqual({
                birthMonth: '2',
                birthDay: '2',
                birthYear: 2000
            });
        });

        it('should get birthday as string', () => {
            expect(component.getBirthday(true)).toEqual('2000/02/02');
        });
    });

    describe('Set Birthday', () => {
        let setStateStub;
        let biData;

        beforeEach(() => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            biData = {
                birthMonth: 12,
                birthDay: 12,
                birthYear: 1912
            };
            component.setBirthday(biData);
        });

        it('should update birthday on form', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                biMonth: biData.birthMonth,
                biDay: biData.birthDay,
                biYear: biData.birthYear
            });
        });
    });

    describe('Set Error State', () => {
        let setStateStub;
        let message;

        beforeEach(() => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            message = 'Error Message';
        });

        it('should check that birthdate is filled and setState accordingly', () => {
            component.setErrorState(message, true);
            expect(setStateStub).toHaveBeenCalledWith({
                biFormError: message,
                monthInvalid: true,
                dayInvalid: true,
                yearInvalid: false
            });
        });

        it('should setState for joinBiForm error', () => {
            component.setErrorState(message, false, true);
            expect(setStateStub).toHaveBeenCalledWith({ biFormError: message });
        });

        it('should setState for default error', () => {
            component.setErrorState(message);
            expect(setStateStub).toHaveBeenCalledWith({
                biFormError: message,
                monthInvalid: true,
                dayInvalid: true
            });
        });
    });

    describe('Reset Error State', () => {
        let setStateStub;

        beforeEach(() => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.resetErrorState();
        });

        it('should call setState with default values', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                biFormError: null,
                monthInvalid: false,
                dayInvalid: false,
                yearInvalid: false
            });
        });
    });

    describe('Validate Error With Code', () => {
        const ErrorConstants = require('utils/ErrorConstants').default;
        let validateErrorWithCode;

        it('should not return any error if DOB is required and fully filled', () => {
            props = {
                biData: {
                    bMon: 2,
                    bDay: 20,
                    bYear: 2000
                },
                biFormTestType: 'default',
                isRequired: true
            };
            const wrapper = shallow(<BiBirthdayForm {...props} />);
            component = wrapper.instance();
            validateErrorWithCode = component.validateErrorWithCode();
            expect(validateErrorWithCode).toEqual(null);
        });

        it('should return Join Bi Birthday error if DOB is required, but not filled', () => {
            props = {
                biFormTestType: 'default',
                isRequired: true
            };
            const wrapper = shallow(<BiBirthdayForm {...props} />);
            component = wrapper.instance();
            validateErrorWithCode = component.validateErrorWithCode();
            expect(validateErrorWithCode).toEqual(ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY);
        });

        it('should not return any error if DOB is not required', () => {
            props = { biFormTestType: 'default' };
            const wrapper = shallow(<BiBirthdayForm {...props} />);
            component = wrapper.instance();
            validateErrorWithCode = component.validateErrorWithCode();
            expect(validateErrorWithCode).toEqual(null);
        });
    });

    describe('Clear Birthday', () => {
        it('should clear all birthday fields and call function', () => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            const setStateStub = spyOn(component, 'setState');
            component.clearBirthday();

            expect(setStateStub).toHaveBeenCalledWith(
                {
                    biMonth: '',
                    biDay: '',
                    biYear: ''
                },
                any(Function)
            );
        });
    });

    describe('Show Error', () => {
        const ErrorConstants = require('utils/ErrorConstants').default;
        let setErrorStateStub;

        beforeEach(() => {
            const wrapper = shallow(<BiBirthdayForm />);
            component = wrapper.instance();
            setErrorStateStub = spyOn(component, 'setErrorState');
        });

        it('should call setErrorState once with correct arguments', () => {
            component.showError('message', 'value', ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY);
            expect(setErrorStateStub).toHaveBeenCalledTimes(1);
            expect(setErrorStateStub).toHaveBeenCalledWith('message', true, false, false);
        });
    });

    describe('Validate Form', () => {
        let ErrorUtils;
        let collectClientFieldErrorsStub;
        let validateStub;
        let resetErrorStateStub;

        beforeEach(() => {
            ErrorUtils = require('utils/Errors').default;
            collectClientFieldErrorsStub = spyOn(ErrorUtils, 'collectClientFieldErrors');
            validateStub = spyOn(ErrorUtils, 'validate');

            props = { ageLimit: 18 };
            const wrapper = shallow(<BiBirthdayForm {...props} />);
            component = wrapper.instance();
            resetErrorStateStub = spyOn(component, 'resetErrorState');
            component.validateForm();
        });

        it('should call collectClientFieldErrors once with correct args', () => {
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith([component]);
        });

        it('should call validate once', () => {
            expect(validateStub).toHaveBeenCalledTimes(1);
        });

        it('should call resetErrorState once', () => {
            expect(resetErrorStateStub).toHaveBeenCalledTimes(1);
        });
    });
});
