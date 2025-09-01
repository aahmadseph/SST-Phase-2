/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const errorsUtils = require('utils/Errors').default;
const store = require('Store').default;
const ErrorsActions = require('actions/ErrorsActions').default;
const ErrorConstants = require('utils/ErrorConstants').default;

describe('Errors utils', () => {
    let Actions;

    describe('validate', () => {
        describe('when no errors exist', () => {
            let initialErrorState, getStateStub, dispatchStub, validateErrors, result;

            beforeEach(() => {
                initialErrorState = {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: {},
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                };

                getStateStub = spyOn(store, 'getState').and.returnValue({ errors: initialErrorState });
                dispatchStub = spyOn(store, 'dispatch');
                validateErrors = spyOn(ErrorsActions, 'validateErrors').and.returnValue({ errors: {} });
                result = errorsUtils.validate();
            });

            it('should call ErrorsActions.validateErrors', () => {
                expect(ErrorsActions.validateErrors).toHaveBeenCalledWith(initialErrorState);
            });

            it('should dispatch a store event', () => {
                expect(dispatchStub).toHaveBeenCalledWith({ errors: {} });
            });

            it('should return false', () => {
                expect(result).toBe(false);
            });
        });

        describe('when there are errors and we want to validate them all', () => {
            let initialErrorState, getStateStub, dispatchStub, validateErrors, result;

            const component1 = shallow(<div />);
            const component2 = shallow(<div />);
            const error1 = {
                getComp: () => component1,
                level: 'FORM',
                location: 'AFTER',
                message: 'This field 1 is required',
                value: 'Error'
            };
            const error2 = {
                getComp: () => component2,
                level: 'FORM',
                location: 'AFTER',
                message: 'This field 2 is required',
                value: 'Error'
            };

            beforeEach(() => {
                initialErrorState = {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: {
                        field1: error1,
                        field2: error2
                    },
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                };

                getStateStub = spyOn(store, 'getState').and.returnValue({ errors: initialErrorState });
                dispatchStub = spyOn(store, 'dispatch');
                validateErrors = spyOn(ErrorsActions, 'validateErrors').and.returnValue({
                    error1,
                    error2
                });
                result = errorsUtils.validate();
            });

            it('should call ErrorsActions.validateErrors', () => {
                expect(ErrorsActions.validateErrors).toHaveBeenCalledWith(initialErrorState);
            });

            it('should dispatch a store event', () => {
                expect(dispatchStub).toHaveBeenCalledWith({
                    error1,
                    error2
                });
            });

            it('should return true', () => {
                expect(result).toBe(true);
            });
        });

        describe('when there are errors and we want to validate one of them', () => {
            let initialErrorState, getStateStub, dispatchStub, validateErrors, result;

            const component1 = shallow(<div />);
            const component2 = shallow(<div />);
            const error1 = {
                getComp: () => component1,
                level: 'FORM',
                location: 'AFTER',
                message: 'This field 1 is required',
                value: 'Error'
            };
            const error2 = {
                getComp: () => component2,
                level: 'FORM',
                location: 'AFTER',
                message: 'This field 2 is required',
                value: 'Error'
            };

            beforeEach(() => {
                initialErrorState = {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: {
                        field1: error1,
                        field2: error2
                    },
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                };

                getStateStub = spyOn(store, 'getState').and.returnValue({ errors: initialErrorState });
                dispatchStub = spyOn(store, 'dispatch');
                validateErrors = spyOn(ErrorsActions, 'validateErrors').and.returnValue({
                    error1,
                    error2
                });
                result = errorsUtils.validate([component1]);
            });

            it('should call ErrorsActions.validateErrors', () => {
                expect(ErrorsActions.validateErrors).toHaveBeenCalledWith(initialErrorState);
            });

            it('should dispatch a store event', () => {
                expect(dispatchStub).toHaveBeenCalledWith({
                    error1,
                    error2
                });
            });

            it('should return true', () => {
                expect(result).toBe(true);
            });
        });

        describe('when there are errors and we want to validate a different one', () => {
            let initialErrorState, getStateStub, dispatchStub, validateErrors, result;

            const component1 = shallow(<div />);
            const component2 = shallow(<div />);
            const component3 = shallow(<div />);
            const error1 = {
                getComp: () => component1,
                level: 'FORM',
                location: 'AFTER',
                message: 'This field 1 is required',
                value: 'Error'
            };
            const error2 = {
                getComp: () => component2,
                level: 'FORM',
                location: 'AFTER',
                message: 'This field 2 is required',
                value: 'Error'
            };

            beforeEach(() => {
                initialErrorState = {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: {
                        field1: error1,
                        field2: error2
                    },
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                };

                getStateStub = spyOn(store, 'getState').and.returnValue({ errors: initialErrorState });
                dispatchStub = spyOn(store, 'dispatch');
                validateErrors = spyOn(ErrorsActions, 'validateErrors').and.returnValue({
                    error1,
                    error2
                });
                result = errorsUtils.validate([component3]);
            });

            it('should call ErrorsActions.validateErrors', () => {
                expect(ErrorsActions.validateErrors).toHaveBeenCalledWith(initialErrorState);
            });

            it('should dispatch a store event', () => {
                expect(dispatchStub).toHaveBeenCalledWith({
                    error1,
                    error2
                });
            });

            it('should return false', () => {
                expect(result).toBe(false);
            });
        });
    });

    describe('placeErrors', () => {
        describe('when the component can showError and message is a string', () => {
            let component, error;

            beforeEach(() => {
                component = shallow(<div />);
                error = {
                    getComp: () => component,
                    level: 'FORM',
                    location: 'AFTER',
                    message: 'This field is required',
                    value: 'Error'
                };

                const initialErrorState = {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: { field: error },
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                };

                spyOn(store, 'getState').and.returnValue({ errors: initialErrorState });
                spyOn(store, 'dispatch');
                spyOn(ErrorsActions, 'validateErrors');

                component.showError = createSpy('showError');

                errorsUtils.validate();
            });

            it('should call showError', () => {
                expect(component.showError).toHaveBeenCalledWith(error.message, error.value, 'field');
            });
        });

        describe('when the component can showError and message is a function', () => {
            let component, error;

            beforeEach(() => {
                component = shallow(<div />);
                error = {
                    getComp: () => component,
                    level: 'FORM',
                    location: 'AFTER',
                    message: createSpy('message').and.returnValue('This field is required'),
                    value: 'Error'
                };

                const initialErrorState = {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: { field: error },
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                };

                spyOn(store, 'getState').and.returnValue({ errors: initialErrorState });
                spyOn(store, 'dispatch');
                spyOn(ErrorsActions, 'validateErrors');

                component.showError = createSpy('showError');

                errorsUtils.validate();
            });

            it('should call message', () => {
                expect(error.message).toHaveBeenCalledWith(component.props);
            });

            it('should call showError', () => {
                expect(component.showError).toHaveBeenCalledWith(error.message(), error.value, 'field');
            });
        });

        describe('when the component doesnt exist and will call placeErrorByDefault', () => {
            let error, getStateStub, dispatchStub, validateErrors, showInfoModalStub;

            beforeEach(() => {
                error = {
                    getComp: () => null,
                    level: 'FORM',
                    location: 'AFTER',
                    message: 'This field is required',
                    value: 'Error'
                };

                const initialErrorState = {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: { field: error },
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                };

                getStateStub = spyOn(store, 'getState').and.returnValue({ errors: initialErrorState });
                dispatchStub = spyOn(store, 'dispatch');
                validateErrors = spyOn(ErrorsActions, 'validateErrors');

                Actions = require('Actions').default;
                showInfoModalStub = spyOn(Actions, 'showInfoModal');

                errorsUtils.validate();
            });

            it('should call dispatchStub with showInfoModalStub', function () {
                expect(dispatchStub).toHaveBeenCalledWith(showInfoModalStub());
            });
        });
    });

    describe('isFormattedError', () => {
        it('should return true for formatted error', () => {
            const message =
                '**The value of points applied exceeds the eligible' +
                ' order subtotal.** Your applied points have been removed and' +
                ' your order total has been updated. To apply points to your' +
                ' purchase please make sure your eligible order subtotal' +
                ' is greater than the value of points you want to apply.';
            expect(errorsUtils.isFormattedError(message)).toEqual(true);
        });

        it('should return false regular error message', () => {
            const message = 'You\'re only $44.00 away from <span data-ship> Free Shipping</span>.';
            expect(errorsUtils.isFormattedError(message)).toEqual(false);
        });

        it('should return false gift error message', () => {
            const message = 'The Gift Card ending in ******zxc is invalid. Please check the number and try to enter again.';
            expect(errorsUtils.isFormattedError(message)).toEqual(false);
        });
    });

    describe('splitFormattedError', () => {
        it('should split formatted message', () => {
            const message =
                '**Merchandise, excluding Gift Cards, must be included in your basket' +
                ' to apply points.** Your applied points have been removed and your order total has been updated.';
            expect(errorsUtils.splitFormattedError(message)).toEqual([
                'Merchandise, excluding Gift Cards, must be included in your basket to apply points.',
                ' Your applied points have been removed and your order total has been updated.'
            ]);
        });

        it('should not split regular message', () => {
            const message = 'The coupon zcasda does not exist. Please check instructions carefully.';
            expect(errorsUtils.splitFormattedError(message)).toEqual([null, message]);
        });
    });
});
