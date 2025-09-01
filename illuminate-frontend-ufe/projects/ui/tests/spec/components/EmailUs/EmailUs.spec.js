const React = require('react');
const { objectContaining, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('EmailUs component', () => {
    const { any } = jasmine;
    let component;
    let EmailUs;

    beforeEach(() => {
        EmailUs = require('components/EmailUs/EmailUs').default;
    });

    describe('validateForm', () => {
        let ErrorsUtils;
        let clearErrorsStub;
        let collectClientFieldErrorsStub;
        let validateStub;
        let setStateStub;

        beforeEach(() => {
            ErrorsUtils = require('utils/Errors').default;
            clearErrorsStub = spyOn(ErrorsUtils, 'clearErrors');
            collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors');
            validateStub = spyOn(ErrorsUtils, 'validate');

            const wrapper = shallow(<EmailUs />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            component.emailInput = createSpy();
            component.firstNameInput = createSpy();
            component.lastNameInput = createSpy();
            component.subjectSelectInput = createSpy();
        });

        describe('if comment field is empty', () => {
            beforeEach(() => {
                component.state = { comment: '' };
                component.validateForm();
            });

            it('should call clearErrors once', () => {
                expect(clearErrorsStub).toHaveBeenCalledTimes(1);
            });

            it('should call collectClientFieldErrors with correct inputs', () => {
                expect(collectClientFieldErrorsStub).toHaveBeenCalledWith([
                    component.emailInput,
                    component.firstNameInput,
                    component.lastNameInput,
                    component.subjectSelectInput
                ]);
            });

            it('should update state for commment field error', () => {
                expect(setStateStub).toHaveBeenCalledWith({ isCommentFieldError: true });
            });

            it('should call validate once', () => {
                expect(validateStub).toHaveBeenCalledTimes(1);
            });
        });

        describe('if comment field is filled', () => {
            beforeEach(() => {
                component.state = { comment: 'here is ya comment right here' };
                component.validateForm();
            });

            it('should call clearErrors once', () => {
                expect(clearErrorsStub).toHaveBeenCalledTimes(1);
            });

            it('should call collectClientFieldErrors with correct inputs', () => {
                expect(collectClientFieldErrorsStub).toHaveBeenCalledWith([
                    component.emailInput,
                    component.firstNameInput,
                    component.lastNameInput,
                    component.subjectSelectInput
                ]);
            });

            it('should not update state', () => {
                expect(setStateStub).not.toHaveBeenCalled();
            });

            it('should call validate once', () => {
                expect(validateStub).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('handleSubmit', () => {
        let e;
        let validateFormStub;
        let utilityApi;
        let contactUsStub;
        let fakePromise;
        let setState;
        let setStateStub;
        let bodyParamsStub;
        let defaultStateStub;
        let getDefaultStateStub;

        beforeEach(() => {
            e = { preventDefault: createSpy() };

            utilityApi = require('services/api/utility').default;
            contactUsStub = spyOn(utilityApi, 'contactUs');

            const wrapper = shallow(<EmailUs />);
            component = wrapper.instance();
            validateFormStub = spyOn(component, 'validateForm');
            setState = component.setState;
            setStateStub = spyOn(component, 'setState');
            defaultStateStub = {
                firstName: '1',
                lastName: '2',
                fromEmail: '',
                biNumber: '',
                orderNumber: '',
                comment: '',
                subjectCode: '',
                subjectValue: ''
            };

            getDefaultStateStub = spyOn(component, 'getDefaultState');
            getDefaultStateStub.and.returnValue(defaultStateStub);

            component.state = {
                firstName: 'firstName',
                lastName: 'lastName',
                fromEmail: 'fromEmail',
                biNumber: 'biNumber',
                orderId: 'orderId',
                subjectCode: 'subjectCode',
                subjectValue: 'subjectValue',
                comment: 'comment',
                isCommentFieldError: false
            };

            bodyParamsStub = {
                firstName: 'firstName',
                lastName: 'lastName',
                fromEmail: 'fromEmail',
                biNumber: 'biNumber',
                orderId: 'orderId',
                subjectCode: 'subjectCode',
                comment: 'comment'
            };
        });

        it('should call e.preventDefault once', () => {
            component.handleSubmit(e);
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should call this.validateForm once', () => {
            component.handleSubmit(e);
            expect(validateFormStub).toHaveBeenCalledTimes(1);
        });

        it('should make call with bodyParams', done => {
            fakePromise = {
                then: resolve => {
                    resolve({ responseStatus: 200 });
                    done();

                    return fakePromise;
                },
                catch: () => () => {}
            };

            contactUsStub.and.returnValue(fakePromise);
            validateFormStub.and.returnValue(true);
            component.handleSubmit(e);
            expect(contactUsStub).toHaveBeenCalledWith(bodyParamsStub);
        });

        it('should setState for showConfirmationModal', done => {
            component.setState = setState;
            setStateStub = spyOn(component, 'setState');
            const expectedState = Object.assign({ showConfirmationModal: true }, defaultStateStub);
            fakePromise = {
                then: resolve => {
                    resolve({ responseStatus: 200 });
                    expect(setStateStub).toHaveBeenCalledWith(expectedState, any(Function));
                    done();

                    return fakePromise;
                },
                catch: () => () => {}
            };

            contactUsStub.and.returnValue(fakePromise);
            validateFormStub.and.returnValue(true);
            component.handleSubmit(e);
        });
    });

    describe('getDefaultState', () => {
        let store;
        let userUtils;
        const userStub = {
            firstName: 'firstName',
            lastName: 'lastName',
            login: 'aaa@example.com'
        };
        let isAnonymousStub;
        let getStateStub;

        beforeEach(() => {
            store = require('Store').default;
            userUtils = require('utils/User').default;
            const wrapper = shallow(<EmailUs />);
            component = wrapper.instance();
            isAnonymousStub = spyOn(userUtils, 'isAnonymous');
            spyOn(userUtils, 'isBI').and.returnValue(false);
            getStateStub = spyOn(store, 'getState');
            getStateStub.and.returnValue({ user: userStub });
        });

        it('should return empty values if user is anonymous', () => {
            isAnonymousStub.and.returnValue(true);
            expect(component.getDefaultState()).toEqual(
                objectContaining({
                    firstName: '',
                    lastName: '',
                    fromEmail: ''
                })
            );
        });

        it('should return user values if user is not anonymous', () => {
            isAnonymousStub.and.returnValue(false);
            expect(component.getDefaultState()).toEqual(
                objectContaining({
                    firstName: 'firstName',
                    lastName: 'lastName',
                    fromEmail: 'aaa@example.com'
                })
            );
        });
    });
});
