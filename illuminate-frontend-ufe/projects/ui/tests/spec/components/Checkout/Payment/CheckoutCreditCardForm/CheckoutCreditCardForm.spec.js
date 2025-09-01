/* eslint-disable no-unused-vars */
const { any, createSpy } = jasmine;
const { PAYMENT_CARDS_DETECTED, UPDATE_ORDER } = require('constants/actionTypes/order');
const { shallow } = require('enzyme');
const React = require('react');

describe('CheckoutCreditCardForm component', () => {
    let checkoutApi;
    let store;
    let OrderActions;
    let EditDataActions;
    let OrderUtils;
    let CheckoutCreditCardForm;
    let ErrorsUtils;
    let CheckoutUtils;
    let CreditCardUtils;
    let watchAction;
    let setAndWatch;
    let setAndWatchStub;
    let wrapper;
    let component;
    let props;
    let watchActionStub;
    let updateEditStoreStub;
    let setStateStub;

    beforeEach(() => {
        checkoutApi = require('services/api/checkout').default;
        store = require('Store').default;
        OrderActions = require('actions/OrderActions').default;
        EditDataActions = require('actions/EditDataActions').default;
        OrderUtils = require('utils/Order').default;
        CheckoutCreditCardForm = require('components/Checkout/Sections/Payment/CheckoutCreditCardForm/CheckoutCreditCardForm').default;
        ErrorsUtils = require('utils/Errors').default;
        CheckoutUtils = require('utils/Checkout').default;
        CreditCardUtils = require('utils/CreditCard').default;
        spyOn(store, 'dispatch');
        const Events = require('utils/framework/Events').default;

        spyOn(Events, 'onLastLoadEvent').and.callFake(() => {});
    });

    describe('Initialize Controller', () => {
        let togglePlaceOrderDisabledStub;
        let updateEditDataSpy;
        let isGuestOrderStub;

        beforeEach(() => {
            watchAction = store.watchAction;
            watchActionStub = spyOn(store, 'watchAction');
            setAndWatch = store.setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');
            togglePlaceOrderDisabledStub = spyOn(OrderActions, 'togglePlaceOrderDisabled');
            updateEditDataSpy = spyOn(EditDataActions, 'updateEditData');
            isGuestOrderStub = spyOn(CheckoutUtils, 'isGuestOrder');
            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {},
                editStore: 'checkoutCreditCardForm'
            };
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            component.cardSecurityCodeInput = { setValue: createSpy() };
            setStateStub = spyOn(component, 'setState');
        });

        it('should watch for action that updates card type user enters in', () => {
            // Arrange
            store.watchAction = watchAction;
            watchActionStub = spyOn(store, 'watchAction');

            // Act
            component.componentDidMount();

            // Assert
            expect(watchActionStub).toHaveBeenCalledWith(PAYMENT_CARDS_DETECTED, any(Function));
        });

        it('should setState for cardType after action is called for a Sephora card', () => {
            component.componentDidMount();
            watchActionStub.calls.first().args[1]({ cardTypes: [OrderUtils.PAYMENT_TYPE.CREDIT_CARD.sephora] });
            expect(setStateStub).toHaveBeenCalledWith({ cardType: 'sephora' });
        });

        it('should setState for cardType after action is called for a non-Sephora card', () => {
            component.componentDidMount();
            watchActionStub.calls.first().args[1]({ cardTypes: ['Visa'] });
            expect(setStateStub).toHaveBeenCalledWith({ cardType: 'Visa' });
        });

        it('should trim security code if not american express and code is > 3', () => {
            component.state = { creditCard: { securityCode: '1234' } };
            component.componentDidMount();
            watchActionStub.calls.first().args[1]({ cardTypes: ['Visa'] });
            expect(component.cardSecurityCodeInput.setValue).toHaveBeenCalledTimes(1);
            expect(component.cardSecurityCodeInput.setValue).toHaveBeenCalledWith('123');
        });

        describe('should call setAndWatch', () => {
            beforeEach(() => {
                // Arrange
                store.setAndWatch = setAndWatch;
                setAndWatchStub = spyOn(store, 'setAndWatch');

                // Act
                wrapper = shallow(<CheckoutCreditCardForm {...props} />);
                component = wrapper.instance();
                component.componentDidMount();
            });

            it('for editData.checkoutCreditCardForm with correct args', () => {
                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('editData.checkoutCreditCardForm', component, any(Function));
            });
        });

        describe('should execute code within', () => {
            let setState;

            beforeEach(() => {
                // Arrange
                wrapper = shallow(<CheckoutCreditCardForm {...props} />);
                component = wrapper.instance();

                store.setAndWatch = setAndWatch;
                setAndWatchStub = spyOn(store, 'setAndWatch');
                setState = spyOn(component, 'setState');

                // Act
                component.componentDidMount();
            });

            it('first setAndWatch', () => {
                // Arrange
                setAndWatchStub.calls.argsFor(0)[2]({ checkoutCreditCardForm: { checkoutCreditCardFormData: 'data' } });

                // Assert
                expect(setState).toHaveBeenCalledWith(any(Function));
            });
        });

        it('should disable place order button', () => {
            component.componentDidMount();
            expect(isGuestOrderStub).toHaveBeenCalled();
        });

        it('should disable place order button', () => {
            component.componentDidMount();
            expect(togglePlaceOrderDisabledStub).toHaveBeenCalled();
            expect(togglePlaceOrderDisabledStub).toHaveBeenCalledWith(true);
        });

        describe('for Guest Checkout', () => {
            let setPlaceOrderPreHook;
            let setPlaceOrderPreHookStub;
            let isPaymentInOrderCompleteStub;
            let validateCreditCardFormStub;
            let validateGuestCreditCardStub;

            beforeEach(() => {
                isGuestOrderStub.and.returnValue(true);
                isPaymentInOrderCompleteStub = spyOn(CheckoutUtils, 'isPaymentInOrderComplete');
                setPlaceOrderPreHook = OrderActions.setPlaceOrderPreHook;
                setPlaceOrderPreHookStub = spyOn(OrderActions, 'setPlaceOrderPreHook');
                validateCreditCardFormStub = spyOn(component, 'validateCreditCardForm');
                validateGuestCreditCardStub = spyOn(component, 'validateGuestCreditCard');
            });

            it('should call setPlaceOrderPreHook', () => {
                // Arrange
                OrderActions.setPlaceOrderPreHook = setPlaceOrderPreHook;
                setPlaceOrderPreHookStub = spyOn(OrderActions, 'setPlaceOrderPreHook');

                // Action
                component.componentDidMount();

                // Assert
                expect(setPlaceOrderPreHookStub).toHaveBeenCalledTimes(1);
                expect(setPlaceOrderPreHookStub).toHaveBeenCalledWith(any(Function));
            });

            it('should call watchAction for when order updates', () => {
                component.componentDidMount();
                expect(watchActionStub.calls.argsFor(3)[0]).toEqual(UPDATE_ORDER);
            });

            describe('when payment is not complete', () => {
                beforeEach(() => {
                    isPaymentInOrderCompleteStub.and.returnValue(false);
                    component.componentDidMount();
                });

                it('should call validateCreditCardForm when placeOrderPreHook is called', () => {
                    setPlaceOrderPreHookStub.calls.first().args[0]({});
                    expect(validateCreditCardFormStub).toHaveBeenCalledTimes(1);
                });

                it('should call validate guest credit card when order gets updated', () => {
                    watchActionStub.calls.argsFor(3)[1]();
                    expect(validateGuestCreditCardStub).toHaveBeenCalledTimes(1);
                });

                it('should disable place order button', () => {
                    expect(togglePlaceOrderDisabledStub).toHaveBeenCalled();
                    expect(togglePlaceOrderDisabledStub).toHaveBeenCalledWith(true);
                });
            });
        });
    });

    describe('Close Credit Card Form', () => {
        beforeEach(() => {
            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {},
                cancelCallback: createSpy()
            };

            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        describe('For Mobile', () => {
            beforeEach(() => {
                spyOn(Sephora, 'isMobile').and.returnValue(true);
                spyOn(Sephora, 'isDesktop').and.returnValue(false);
                component.closeCreditCardForm();
            });

            it('should call setState and set isOpen to false', () => {
                expect(setStateStub).toHaveBeenCalledWith({ isOpen: false }, undefined);
            });

            it('should call callback passed in props', () => {
                expect(component.props.cancelCallback).toHaveBeenCalledTimes(1);
            });
        });

        describe('For Desktop', () => {
            beforeEach(() => {
                spyOn(Sephora, 'isMobile').and.returnValue(false);
                spyOn(Sephora, 'isDesktop').and.returnValue(true);
                component.closeCreditCardForm();
            });

            it('should not call setState', () => {
                expect(setStateStub).not.toHaveBeenCalled();
            });

            it('should call callback passed in props', () => {
                expect(component.props.cancelCallback).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Check Credit Card', () => {
        let e;
        let paymentCardNumberChangedStub;

        beforeEach(() => {
            e = { target: { value: '4111' } };
            paymentCardNumberChangedStub = spyOn(OrderActions, 'paymentCardNumberChanged');

            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {}
            };
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.checkCreditCard(e);
        });

        it('should dispatch orderActions.paymentCardNumberChanged', () => {
            expect(paymentCardNumberChangedStub).toHaveBeenCalledTimes(1);
        });

        it('should dispatch orderActions.paymentCardNumberChanged with 4111 as an argument', () => {
            expect(paymentCardNumberChangedStub).toHaveBeenCalledWith('4111');
        });

        it('should update credit card number', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('cardNumber', '4111');
        });

        it('should format the credit card number correctly', () => {
            // Arrange
            e = { target: { value: '1234567890123456' } };
            const expectedFormattedValue = '1234 5678 9012 3456';
            component.state.chunkCreditCardInCheckout = true;
            spyOn(CreditCardUtils, 'formatCardNumber').and.returnValue(expectedFormattedValue);

            // Act
            component.checkCreditCard(e);

            // Assert
            expect(CreditCardUtils.formatCardNumber).toHaveBeenCalledWith(e.target.value);
            expect(component.state.creditCard.formattedCardNumber).toEqual(expectedFormattedValue);
        });
    });

    describe('Handle ExpMonth onBlur', () => {
        beforeEach(() => {
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.expMonthInput = {
                getValue: createSpy(),
                setValue: createSpy()
            };
        });

        it('should not call updateEditStore since month remains the same', () => {
            component.cardMonthInput = { getValue: createSpy().and.returnValue('12') };
            component.handleExpMonthOnBlur();
            expect(updateEditStoreStub).not.toHaveBeenCalled();
        });

        it('should call update expiration month with new formatted value', () => {
            component.cardMonthInput.current = { getValue: createSpy().and.returnValue('1') };
            component.handleExpMonthOnBlur();
            expect(updateEditStoreStub).toHaveBeenCalledWith('expirationMonth', '01');
        });
    });

    describe('Handle Use Shipping Address', () => {
        let e;

        beforeEach(() => {
            e = { preventDefault: createSpy() };

            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {}
            };
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.state = { isUseShippingAddressAsBilling: true };
            component.handleUseShippingAddress(e);
        });

        it('should set state with useShippingAddress set to false', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('isUseShippingAddressAsBilling', false, true);
        });
    });

    describe('Add or Update Credit Card', () => {
        let addCreditCardToOrderStub;
        let updateCreditCardOnOrderStub;
        let component2;
        let props2;

        beforeEach(() => {
            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {}
            };
            addCreditCardToOrderStub = spyOn(checkoutApi, 'addCreditCardToOrder').and.returnValue(Promise.resolve());
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();

            props2 = {
                creditCard: {
                    address: {},
                    creditCardId: '12345'
                },
                isEditMode: true,
                shippingAddress: {}
            };
            updateCreditCardOnOrderStub = spyOn(checkoutApi, 'updateCreditCardOnOrder').and.returnValue(Promise.resolve());
            wrapper = shallow(<CheckoutCreditCardForm {...props2} />);
            component2 = wrapper.instance();

            component.addressForm = component2.addressForm = { getData: createSpy().and.returnValue({ address: {} }) };
        });

        describe('standard add credit card flow', () => {
            beforeEach(() => {
                component.state.isUseShippingAddressAsBilling = true;
                component.state.isMarkAsDefault = true;
                component.state.cardType = 'visa';
                component.state.creditCard = {
                    firstName: 'fgggggg',
                    lastName: 'jjjjjj',
                    expirationMonth: '06',
                    expirationYear: '16',
                    securityCode: '345',
                    cardNumber: '23458456744'
                };
                component.addOrUpdateCreditCard();
            });

            it('should call checkoutApi.addCreditCardToOrder', () => {
                expect(addCreditCardToOrderStub.calls.mostRecent().args[0]).toEqual({
                    isUseShippingAddressAsBilling: true,
                    isSaveCreditCardForFutureUse: true,
                    isMarkAsDefault: true,
                    creditCard: {
                        firstName: 'fgggggg',
                        lastName: 'jjjjjj',
                        expirationMonth: 6,
                        expirationYear: 2016,
                        securityCode: '345',
                        cardType: 'visa',
                        cardNumber: '23458456744'
                    }
                });
            });
        });

        describe('standard update credit card flow', () => {
            beforeEach(() => {
                component2.state.isUseShippingAddressAsBilling = true;
                component2.state.isMarkAsDefault = true;
                component2.state.creditCard = {
                    firstName: 'asdfasdf',
                    lastName: 'hsfgbawe',
                    expirationMonth: '01',
                    expirationYear: 26,
                    securityCode: '534',
                    address: {},
                    creditCardId: '12345'
                };
                component2.addOrUpdateCreditCard();
            });

            it('should call checkoutApi.updateCreditCardOnOrder', () => {
                const expectedData = Object.assign(component2.state.creditCard);
                expectedData.expirationMonth = 1;
                expectedData.expirationYear = 2026;
                expect(updateCreditCardOnOrderStub).toHaveBeenCalledWith(
                    {
                        isMarkAsDefault: true,
                        creditCard: expectedData
                    },
                    'update'
                );
            });
        });

        describe('using shipping address as billing address', () => {
            beforeEach(() => {
                component.state = {
                    isUseShippingAddressAsBilling: true,
                    creditCard: { expirationYear: '' }
                };
                component.addOrUpdateCreditCard();
            });

            it('should not call addressForm getData', () => {
                expect(component.addressForm.getData).not.toHaveBeenCalled();
            });
        });

        describe('using a new billing address', () => {
            beforeEach(() => {
                component.state = {
                    isUseShippingAddressAsBilling: false,
                    creditCard: { expirationYear: '' }
                };
                component.addOrUpdateCreditCard();
            });

            it('should not call addressForm.getData', () => {
                expect(component.addressForm.getData).toHaveBeenCalled();
            });
        });
    });

    describe('Is Credit Card Form Empty', () => {
        beforeEach(() => {
            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {}
            };
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            component.state = {
                cardType: 'VISA',
                isUseShippingAddressAsBilling: true
            };
        });

        it('should return true', () => {
            component.cardMonthInput.current = { getValue: createSpy().and.returnValue('') };
            component.cardYearInput.current = { getValue: createSpy().and.returnValue('') };
            component.cardSecurityCodeInput = { getValue: createSpy().and.returnValue('') };
            component.cardNumberInput = { getValue: createSpy().and.returnValue('') };
            component.addressForm = { getData: createSpy().and.returnValue({ address: {} }) };
            const isCreditCardFormEmpty = component.isCreditCardFormEmpty();
            expect(isCreditCardFormEmpty).toEqual(true);
        });

        it('should return false', () => {
            component.cardMonthInput.current = { getValue: createSpy().and.returnValue('10') };
            component.cardYearInput.current = { getValue: createSpy().and.returnValue('2019') };
            component.cardSecurityCodeInput = { getValue: createSpy().and.returnValue('123') };
            component.cardNumberInput = { getValue: createSpy().and.returnValue('1234123412341234') };
            component.addressForm = { getData: createSpy().and.returnValue({ address: {} }) };
            const isCreditCardFormEmpty = component.isCreditCardFormEmpty();
            expect(isCreditCardFormEmpty).toEqual(false);
        });
    });

    describe('componentDidUpdate for Guest Checkout', () => {
        let isPaymentInOrderCompleteStub;
        let isGuestOrderStub;
        let validateGuestCreditCardStub;

        beforeEach(() => {
            isPaymentInOrderCompleteStub = spyOn(CheckoutUtils, 'isPaymentInOrderComplete');
            isGuestOrderStub = spyOn(CheckoutUtils, 'isGuestOrder').and.returnValue(true);
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            validateGuestCreditCardStub = spyOn(component, 'validateGuestCreditCard');
        });

        it('should validateGuestCreditCard if payment is not complete', () => {
            isPaymentInOrderCompleteStub.and.returnValue(false);
            component.componentDidUpdate();
            expect(validateGuestCreditCardStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('Validate Credit Card Form', () => {
        let e;
        let clearErrorsStub;
        let collectClientFieldErrorsStub;
        let validateStub;
        let addOrUpdateCreditCardStub;
        let fieldsForValidation;

        beforeEach(() => {
            e = { preventDefault: createSpy() };

            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {},
                cancelCallback: createSpy()
            };
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            component.cardFirstNameInput = {};
            component.cardLastNameInput = {};
            component.cardMonthInput = { current: {} };
            component.cardYearInput = { current: {} };
            component.cardSecurityCodeInput = {};
            component.cardNumberInput = {};
            component.state = { isUseShippingAddressAsBilling: true };

            fieldsForValidation = [
                component.cardNumberInput,
                component.cardMonthInput.current,
                component.cardYearInput.current,
                component.cardSecurityCodeInput,
                component.cardFirstNameInput,
                component.cardLastNameInput
            ];

            clearErrorsStub = spyOn(ErrorsUtils, 'clearErrors');
            collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors');
            validateStub = spyOn(ErrorsUtils, 'validate').and.returnValue(false);
            addOrUpdateCreditCardStub = spyOn(component, 'addOrUpdateCreditCard');

            component.validateCreditCardForm(e);
        });

        it('should call ErrorUtils.clearErrors once', () => {
            expect(clearErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should call ErrorUtils.collectClientFieldErrors once', () => {
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should call ErrorUtils.collectClientFieldErrors with correct from data', () => {
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(fieldsForValidation);
        });

        it('should call ErrorUtils.validate once', () => {
            expect(validateStub).toHaveBeenCalledTimes(1);
        });

        it('should call addOrUpdateCreditCard', () => {
            expect(addOrUpdateCreditCardStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('Save Credit Card OnChange', () => {
        beforeEach(() => {
            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {}
            };
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.state = {
                isSaveCreditCardForFutureUse: false,
                isMarkAsDefault: true
            };
            component.saveCreditCardOnChange();
        });

        it('should update edit store twice ', () => {
            expect(updateEditStoreStub).toHaveBeenCalledTimes(2);
        });

        it('should update isSaveCreditCardForFutureUse ', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('isSaveCreditCardForFutureUse', true, true);
        });

        it('should update isMarkAsDefault ', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('isMarkAsDefault', true, true);
        });
    });

    describe('Mark As Default OnChange', () => {
        beforeEach(() => {
            props = {
                creditCard: {},
                isEditMode: false,
                shippingAddress: {}
            };
            wrapper = shallow(<CheckoutCreditCardForm {...props} />);
            component = wrapper.instance();
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.state = {
                isSaveCreditCardForFutureUse: true,
                isMarkAsDefault: true
            };
            component.markAsDefaultOnChange();
        });

        it('should update edit store twice ', () => {
            expect(updateEditStoreStub).toHaveBeenCalledTimes(2);
        });

        it('should update isSaveCreditCardForFutureUse ', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('isSaveCreditCardForFutureUse', true, true);
        });

        it('should update isMarkAsDefault ', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('isMarkAsDefault', false, true);
        });
    });
});
