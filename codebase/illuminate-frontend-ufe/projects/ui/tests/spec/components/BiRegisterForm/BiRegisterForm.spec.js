/* eslint-disable object-curly-newline */
const React = require('react');
const { createSpy } = jasmine;
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('BiRegisterForm component', () => {
    let component;
    let props;
    let BiRegisterForm;

    beforeEach(() => {
        BiRegisterForm = require('components/BiRegisterForm/BiRegisterForm').default;
    });

    describe('componentDidMount', () => {
        let localeUtils;
        let isCanadaStub;
        let setStateStub;

        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            const wrapper = shallow(<BiRegisterForm {...props} />);
            component = wrapper.instance();
            isCanadaStub = spyOn(localeUtils, 'isCanada').and.returnValue(false);
            setStateStub = spyOn(component, 'setState');
            component.componentDidMount();
        });

        it('should call localeUtils.isCanada once', () => {
            expect(isCanadaStub).toHaveBeenCalledTimes(1);
        });

        it('should set the state of component with isCanada', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                isCALocale: false
            });
        });
    });

    describe('validateErrorWithCode', () => {
        let validateErrorWithCode;
        const ErrorConstants = require('utils/ErrorConstants').default;

        it('should return join bi error when' + ' birthday partially filled and join is not checked', () => {
            props = {
                biFormTestType: 'default'
            };
            const wrapper = shallow(<BiRegisterForm {...props} />);
            component = wrapper.instance();
            component.birthdayForm = {
                getMonth: createSpy().and.returnValue('10'),
                getDay: createSpy().and.returnValue(''),
                getYear: createSpy().and.returnValue('')
            };
            component.state = {
                isJoinBIChecked: false
            };
            validateErrorWithCode = component.validateErrorWithCode();
            expect(validateErrorWithCode).toEqual(ErrorConstants.ERROR_CODES.JOIN_BI);
        });

        it('should return join bi birthday error when birthday partially filled and join is checked', () => {
            props = {
                biFormTestType: 'default'
            };
            const wrapper = shallow(<BiRegisterForm {...props} />);
            component = wrapper.instance();
            component.birthdayForm = {
                getMonth: createSpy().and.returnValue('10'),
                getDay: createSpy().and.returnValue(''),
                getYear: createSpy().and.returnValue('')
            };
            component.state = {
                isJoinBIChecked: true
            };
            validateErrorWithCode = component.validateErrorWithCode();
            expect(validateErrorWithCode).toEqual(ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY);
        });

        it('should return join bi error for bi modal with missing info', () => {
            props = {
                biFormTestType: 'default',
                isBiModal: true
            };
            const wrapper = shallow(<BiRegisterForm {...props} />);
            component = wrapper.instance();
            component.birthdayForm = {
                getMonth: createSpy().and.returnValue(''),
                getDay: createSpy().and.returnValue(''),
                getYear: createSpy().and.returnValue('')
            };
            component.state = {
                isJoinBIChecked: false
            };
            validateErrorWithCode = component.validateErrorWithCode();
            expect(validateErrorWithCode).toEqual(ErrorConstants.ERROR_CODES.JOIN_BI);
        });

        it('should return join bi error when birthday filled and' + ' join box not checked', () => {
            props = {
                isOrderConfirmation: true,
                biFormTestType: 'default'
            };
            const wrapper = shallow(<BiRegisterForm {...props} />);
            component = wrapper.instance();
            component.birthdayForm = {
                getMonth: createSpy().and.returnValue('10'),
                getDay: createSpy().and.returnValue('1'),
                getYear: createSpy().and.returnValue('2012')
            };
            component.state = {
                isJoinBIChecked: false
            };
            validateErrorWithCode = component.validateErrorWithCode();
            expect(validateErrorWithCode).toEqual(ErrorConstants.ERROR_CODES.JOIN_BI);
        });
    });

    describe('showError', () => {
        const ErrorConstants = require('utils/ErrorConstants').default;
        let setErrorStateStub;

        beforeEach(() => {
            setErrorStateStub = createSpy();

            const wrapper = shallow(<BiRegisterForm />);
            component = wrapper.instance();
            component.birthdayForm = {
                setErrorState: setErrorStateStub
            };
        });

        it('should call birthdayForm.setErrorState for Join Bi Error', () => {
            component.showError('joinBiError', null, ErrorConstants.ERROR_CODES.JOIN_BI);
            expect(setErrorStateStub).toHaveBeenCalledTimes(1);
            expect(setErrorStateStub).toHaveBeenCalledWith('joinBiError', false, true);
        });

        it('should call birthdayForm.setErrorState for Join Birthday Error', () => {
            component.showError('joinBirthdayError', null, ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY);
            expect(setErrorStateStub).toHaveBeenCalledTimes(1);
            expect(setErrorStateStub).toHaveBeenCalledWith('joinBirthdayError', true, false);
        });
    });

    describe('validateForm', () => {
        let ErrorsUtils;
        let clearErrorsStub;
        let collectClientFieldErrorsStub;
        let validateStub;
        let resetErrorStateStub;
        let validateBirthdayForm;

        beforeEach(() => {
            ErrorsUtils = require('utils/Errors').default;
            clearErrorsStub = spyOn(ErrorsUtils, 'clearErrors');
            collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors');
            validateStub = spyOn(ErrorsUtils, 'validate');

            resetErrorStateStub = createSpy();
            validateBirthdayForm = createSpy();

            const wrapper = shallow(<BiRegisterForm />);
            component = wrapper.instance();
            component.birthdayForm = {
                resetErrorState: resetErrorStateStub,
                validateForm: validateBirthdayForm
            };
        });

        it('should call birthdayForm.resetErrorState once', () => {
            component.validateForm();
            expect(resetErrorStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call ErrorUtils.clearErrors once', () => {
            component.validateForm();
            expect(clearErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should not call ErrorUtils.clearErrors if doNotClearErrors is true', () => {
            component.validateForm(true);
            expect(clearErrorsStub).not.toHaveBeenCalled();
        });

        it('should call ErrorUtils.collectClientFieldErrors once and with [this]', () => {
            component.validateForm();
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith([component]);
        });

        it('should call ErrorUtils.validate once', () => {
            component.validateForm();
            expect(validateStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleJoinBIClick', () => {
        let e;
        let setStateStub;

        describe('for guest checkout', () => {
            beforeEach(() => {
                props = {
                    isGuestCheckout: true,
                    callback: createSpy()
                };
                const wrapper = shallow(<BiRegisterForm {...props} />);
                component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
                component.birthdayForm = {
                    clearBirthday: createSpy()
                };
            });

            describe('when checkbox is checked', () => {
                beforeEach(() => {
                    e = {
                        target: {
                            checked: true
                        }
                    };
                    component.handleJoinBIClick(e);
                });

                it('should setState with correct values', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        isJoinBIChecked: true,
                        biFormError: null,
                        birthdayDisabled: false
                    });
                });

                it('should call callback function', () => {
                    expect(component.props.callback).toHaveBeenCalledTimes(1);
                });

                it('should not call birthdayForm.clearBirthday function', () => {
                    expect(component.birthdayForm.clearBirthday).not.toHaveBeenCalled();
                });
            });

            describe('when checkbox is unchecked', () => {
                beforeEach(() => {
                    e = {
                        target: {
                            checked: false
                        }
                    };
                    component.handleJoinBIClick(e);
                });

                it('should setState with correct values', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        isJoinBIChecked: false,
                        biFormError: null,
                        birthdayDisabled: true
                    });
                });

                it('should call callback function', () => {
                    expect(component.props.callback).toHaveBeenCalledTimes(1);
                });

                it('should call birthdayForm.clearBirthday function', () => {
                    expect(component.birthdayForm.clearBirthday).toHaveBeenCalledTimes(1);
                });
            });
        });

        describe('for non guest checkout', () => {
            beforeEach(() => {
                props = {
                    isGuestCheckout: false,
                    callback: createSpy()
                };
                const wrapper = shallow(<BiRegisterForm {...props} />);
                component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
            });

            describe('when checkbox is checked', () => {
                beforeEach(() => {
                    e = {
                        target: {
                            checked: true
                        }
                    };
                    component.handleJoinBIClick(e);
                });

                it('should setState with correct values', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        isJoinBIChecked: true,
                        biFormError: null
                    });
                });

                it('should call callback function', () => {
                    expect(component.props.callback).toHaveBeenCalledTimes(1);
                });
            });

            describe('when checkbox is unchecked', () => {
                beforeEach(() => {
                    e = {
                        target: {
                            checked: false
                        }
                    };
                    component.handleJoinBIClick(e);
                });

                it('should setState with correct values', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        isJoinBIChecked: false,
                        biFormError: null
                    });
                });

                it('should call callback function', () => {
                    expect(component.props.callback).toHaveBeenCalledTimes(1);
                });
            });
        });
    });

    describe('handleTermsClick', () => {
        let e;
        let store;
        let dispatchStub;
        let TermsAndConditionsActions;
        let showModalStub;

        beforeEach(() => {
            e = {
                preventDefault: createSpy()
            };

            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            TermsAndConditionsActions = require('actions/TermsAndConditionsActions').default;
            showModalStub = spyOn(TermsAndConditionsActions, 'showModal').and.returnValue('showModal');

            const wrapper = shallow(<BiRegisterForm />);
            component = wrapper.instance();
            component.handleTermsClick(e);
        });

        it('should call e.preventDefault once', () => {
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch once with showModal action', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(dispatchStub).toHaveBeenCalledWith('showModal');
        });

        it('should call TermsAndConditionsActions.showModal with correct values', () => {
            expect(showModalStub).toHaveBeenCalledWith(true, '36800022', 'Beauty Insider Terms & Conditions');
        });
    });

    describe('getBIFormError', () => {
        let getBIFormErrorStub;
        let biFormErrorStub;

        beforeEach(() => {
            getBIFormErrorStub = createSpy().and.returnValue('biFormError');

            const wrapper = shallow(<BiRegisterForm />);
            component = wrapper.instance();
            component.birthdayForm = {
                getBIFormError: getBIFormErrorStub
            };
            biFormErrorStub = component.getBIFormError();
        });

        it('should call birthdayForm.getBIFormError once', () => {
            expect(getBIFormErrorStub).toHaveBeenCalledTimes(1);
            expect(biFormErrorStub).toEqual('biFormError');
        });
    });

    describe('getBIDate', () => {
        let getBirthdayStub;
        let birthdate;

        beforeEach(() => {
            getBirthdayStub = createSpy().and.returnValue('BIRTHDAY');
        });

        describe('when isJoinBI checkbox is checked', () => {
            beforeEach(() => {
                const wrapper = shallow(<BiRegisterForm />);
                component = wrapper.instance();
                component.birthdayForm = {
                    getBirthday: getBirthdayStub
                };
                component.state = {
                    isJoinBIChecked: true
                };
                birthdate = component.getBIDate();
            });

            it('should call birthdayForm.getBirthday and return birthday', () => {
                expect(getBirthdayStub).toHaveBeenCalledTimes(1);
                expect(birthdate).toEqual('BIRTHDAY');
            });
        });

        it('should not call birthdayForm.getBirthday and return null', () => {
            props = {
                biFormTestType: 'default'
            };
            const wrapper = shallow(<BiRegisterForm {...props} />);
            component = wrapper.instance();
            birthdate = component.getBIDate();

            expect(getBirthdayStub).not.toHaveBeenCalled();
            expect(birthdate).toEqual(null);
        });
    });

    describe('setBiDate', () => {
        let setBirthdayStub;

        beforeEach(() => {
            setBirthdayStub = createSpy();
            const wrapper = shallow(<BiRegisterForm />);
            component = wrapper.instance();
            component.birthdayForm = {
                setBirthday: setBirthdayStub
            };
            component.setBiDate('birthday');
        });

        it('should call birthdayForm.setBirthday with correct birthday', () => {
            expect(setBirthdayStub).toHaveBeenCalledTimes(1);
            expect(setBirthdayStub).toHaveBeenCalledWith('birthday');
        });
    });

    describe('setErrorState', () => {
        let setErrorStateStub;

        beforeEach(() => {
            setErrorStateStub = createSpy();
            const wrapper = shallow(<BiRegisterForm />);
            component = wrapper.instance();
            component.birthdayForm = {
                setErrorState: setErrorStateStub
            };
            component.setErrorState('ERROR');
        });

        it('should call birthdayForm.setErrorState once with error', () => {
            expect(setErrorStateStub).toHaveBeenCalledTimes(1);
            expect(setErrorStateStub).toHaveBeenCalledWith('ERROR', false, false);
        });
    });
});
