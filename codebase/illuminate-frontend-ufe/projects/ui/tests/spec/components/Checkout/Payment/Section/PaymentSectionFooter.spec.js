/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;

xdescribe('Payment Section Footer', () => {
    const PaymentSectionFooter = require('components/Checkout/Sections/Payment/Section/PaymentSectionFooter/PaymentSectionFooter').default;
    const store = require('Store').default;
    const OrderActions = require('actions/OrderActions').default;
    const checkoutApi = require('services/api/checkout').default;
    const Location = require('utils/Location').default;
    const checkoutUtils = require('utils/Checkout').default;
    const ErrorsUtils = require('utils/Errors').default;
    const INTERSTICE_DELAY_MS = require('components/Checkout/constants').INTERSTICE_DELAY_MS;

    const decorators = require('utils/decorators').default;

    let component;
    let wrapper;
    let props;
    let e;
    let clearErrorsStub;
    let collectClientFieldErrorsStub;
    let validateStub;
    let updateCreditCardOnOrderStub;
    let updatePayPalCheckoutStub;
    let isPaymentSectionCompleteStub;
    let sectionSavedStub;
    let withIntersticeStub;

    describe('Save And Continue', function () {
        beforeEach(function () {
            spyOn(store, 'dispatch');
            e = { preventDefault: createSpy() };
            clearErrorsStub = spyOn(ErrorsUtils, 'clearErrors');
            collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors');
            validateStub = spyOn(ErrorsUtils, 'validate').and.returnValue(false);
            updateCreditCardOnOrderStub = spyOn(checkoutApi, 'updateCreditCardOnOrder').and.returnValue(Promise.resolve());
            updatePayPalCheckoutStub = spyOn(checkoutApi, 'updatePayPalCheckout').and.returnValue(Promise.resolve());
            withIntersticeStub = spyOn(decorators, 'withInterstice').and.returnValue(() => {
                return {
                    then: () => {
                        return { catch: () => {} };
                    }
                };
            });
            isPaymentSectionCompleteStub = spyOn(checkoutUtils, 'isPaymentSectionComplete').and.returnValue(true);
            sectionSavedStub = spyOn(OrderActions, 'sectionSaved');
            wrapper = shallow(<PaymentSectionFooter />);
            component = wrapper.instance();
        });

        it('should call e.preventDefault once', () => {
            component.saveAndContinue(e);
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should call clearErrors once', () => {
            component.saveAndContinue(e);
            expect(clearErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should call collectClientFieldErrors once', () => {
            component.saveAndContinue(e);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should call validate once', () => {
            component.saveAndContinue(e);
            expect(validateStub).toHaveBeenCalledTimes(1);
        });

        it('should call isPaymentSectionCompleteStub once if we get into else', () => {
            component.saveAndContinue(e);
            expect(isPaymentSectionCompleteStub).toHaveBeenCalledTimes(1);
        });

        it('should call OrderActions.sectionSaved once if we get into else', () => {
            component.saveAndContinue(e);
            expect(sectionSavedStub).toHaveBeenCalledTimes(1);
        });

        it('should call checkoutApi.updateCreditCardOnOrder once if we get into if', () => {
            props = { selectedCreditCardId: 12345 };
            wrapper = shallow(<PaymentSectionFooter {...props} />);
            component = wrapper.instance();
            component.saveAndContinue(e);
            expect(withIntersticeStub).toHaveBeenCalledWith(updateCreditCardOnOrderStub, INTERSTICE_DELAY_MS);
        });

        it('should call checkoutApi.updatePayPalCheckoutStub once if we get into if', () => {
            props = {
                isPayWithPayPal: true,
                isPayPalSelected: false,
                paypalOption: { email: 'test@email.com' }
            };
            wrapper = shallow(<PaymentSectionFooter {...props} />);
            component = wrapper.instance();
            component.saveAndContinue(e);
            expect(withIntersticeStub).toHaveBeenCalledWith(updatePayPalCheckoutStub, INTERSTICE_DELAY_MS);
        });
    });
});
