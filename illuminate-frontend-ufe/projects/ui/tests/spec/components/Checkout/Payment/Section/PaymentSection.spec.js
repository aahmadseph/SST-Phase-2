/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any, createSpy } = jasmine;

describe('PaymentSectionExistingUser component', () => {
    let UtilActions;
    let OrderUtils;
    let creditCardUtils;
    let checkoutUtils;
    let decorators;
    let PayPal;
    let ApplePay;
    let OrderActions;
    let store;
    let processEvent;
    let anaConsts;
    let PaymentSectionExistingUser;
    const PAYMENT_FLAGS = {
        isPayWithPayPal: 'isPayWithPayPal',
        isPayWithApplePay: 'isPayWithApplePay',
        isNewUserPayWithCreditCard: 'isNewUserPayWithCreditCard'
    };
    let setStateStub;
    let component;
    let props;

    beforeEach(() => {
        UtilActions = require('utils/redux/Actions').default;
        OrderUtils = require('utils/Order').default;
        creditCardUtils = require('utils/CreditCard').default;
        checkoutUtils = require('utils/Checkout').default;
        decorators = require('utils/decorators').default;
        PayPal = require('utils/PayPal').default;
        ApplePay = require('services/ApplePay').default;
        OrderActions = require('actions/OrderActions').default;
        store = require('Store').default;
        processEvent = require('analytics/processEvent').default;
        anaConsts = require('analytics/constants').default;
        PaymentSectionExistingUser =
            require('components/Checkout/Sections/Payment/Section/PaymentSectionExistingUser/PaymentSectionExistingUser').default;

        spyOn(store, 'dispatch');
    });

    describe('Handle Show More OnClick', () => {
        beforeEach(() => {
            props = {
                creditCardOptions: [{}, {}, {}, {}, {}]
            };
            const wrapper = shallow(<PaymentSectionExistingUser {...props} />);
            component = wrapper.instance();
            wrapper.setState({ creditCardsToDisplay: 3 });
            setStateStub = spyOn(component, 'setState');
            component.handleShowMoreOnClick();
        });

        it('should set state for creditCardsToDisplay to 5', () => {
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    creditCardsToDisplay: 5
                },
                any(Function)
            );
        });
    });

    describe('Handle Show Less OnClick', () => {
        beforeEach(() => {
            const wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            component.state = {
                creditCardsToDisplay: 10
            };
            setStateStub = spyOn(component, 'setState');
            component.handleShowLessOnClick();
        });

        it('should set state for creditCardsToDisplay to 3', () => {
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    creditCardsToDisplay: 3
                },
                any(Function)
            );
        });
    });

    describe('Handle Pay With PayPal OnClick', () => {
        let showPayPalStub;
        let switchPaymentStateStub;
        let containsRestrictedItemStub;
        let showErrorStub;
        let withIntersticeStub;
        let intersticeDoneStub;
        let isGuestOrderStub;
        let wrapper;

        beforeEach(() => {
            showPayPalStub = spyOn(PayPal, 'showPayPal').and.callFake(arg0 => arg0());
            intersticeDoneStub = createSpy().and.returnValue({
                then: createSpy().and.callFake(arg0 => arg0())
            });
            withIntersticeStub = spyOn(decorators, 'withInterstice').and.returnValue(intersticeDoneStub);
            isGuestOrderStub = spyOn(checkoutUtils, 'isGuestOrder');
            wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            switchPaymentStateStub = spyOn(component, 'switchPaymentState');
            containsRestrictedItemStub = spyOn(OrderUtils, 'containsRestrictedItem');
            showErrorStub = spyOn(component, 'showError');
        });

        it('should call this.showError if there are restricted items', () => {
            containsRestrictedItemStub.and.returnValue(true);
            component.handlePayWithPayPalOnClick();
            expect(showErrorStub).toHaveBeenCalledTimes(1);
        });

        it('should call showPayPal since no props.paypalOption and is not edit', () => {
            component.handlePayWithPayPalOnClick();
            expect(showPayPalStub).toHaveBeenCalledTimes(1);
        });

        it('should not call showPayPal if isEdit is false', () => {
            wrapper.setProps({ paypalOption: {} });
            component.handlePayWithPayPalOnClick(false);
            expect(showPayPalStub).not.toHaveBeenCalled();
            expect(switchPaymentStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call showPayPal if isEdit is true', () => {
            wrapper.setProps({ paypalOption: {} });
            component.handlePayWithPayPalOnClick(true);
            expect(showPayPalStub).toHaveBeenCalledTimes(1);
        });

        it('should set Paypal Radio to active state for Guest Checkout flow', () => {
            wrapper.setProps({ paypalOption: {} });
            isGuestOrderStub.and.returnValue(true);
            component.handlePayWithPayPalOnClick(true);
            expect(switchPaymentStateStub).toHaveBeenCalledWith(PAYMENT_FLAGS.isPayWithPayPal);
        });
    });

    describe('Handle Pay With ApplePay Click', () => {
        let switchPaymentStateStub;
        let isGuestOrderStub;
        let enableGuestCheckoutStub;

        beforeEach(() => {
            const wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            switchPaymentStateStub = spyOn(component, 'switchPaymentState');
            isGuestOrderStub = spyOn(checkoutUtils, 'isGuestOrder');
            enableGuestCheckoutStub = spyOn(ApplePay, 'enableGuestCheckout');
        });

        it('should call switchPaymentState', () => {
            component.handlePayWithApplePayClick();
            expect(switchPaymentStateStub).toHaveBeenCalledTimes(1);
        });

        it('should enable Guest Checkout flow for ApplePay', () => {
            isGuestOrderStub.and.returnValue(true);
            component.handlePayWithApplePayClick();
            expect(enableGuestCheckoutStub).toHaveBeenCalledTimes(1);
        });
    });

    // that's a probably wrong test, because it's call function for a new user
    // describe('Handle Pay With Credit Card OnClick', () => {
    //     let switchPaymentStateStub;
    //
    //     beforeEach(() => {
    //         const wrapper = shallow(<PaymentSectionExistingUser />);
    //         component = wrapper.instance();
    //         switchPaymentStateStub = spyOn(component, 'switchPaymentState');
    //     });
    //
    //     // it('should call switchPaymentState', () => {
    //     //     component.handleNewUserPayWithCreditCardOnClick();
    //     //     expect(switchPaymentStateStub).toHaveBeenCalledTimes(1);
    //     // });
    // });

    describe('Switch Payment State', () => {
        let setApplePayFlowStub;
        let orderReviewIsActiveStub;

        beforeEach(() => {
            setApplePayFlowStub = spyOn(UtilActions, 'merge');
            orderReviewIsActiveStub = spyOn(OrderActions, 'orderReviewIsActive');
            const wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should update state', () => {
            component.switchPaymentState('isNewUserPayWithCreditCard');
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    selectedCreditCardId: null,
                    isPayWithPayPal: false,
                    isPayWithApplePay: false,
                    isPayWithKlarna: false,
                    isPayWithAfterpay: false,
                    isPayWithPaze: false,
                    isNewUserPayWithCreditCard: true
                },
                any(Function)
            );
        });

        it('should call OrderActions.setApplePayFlow once', () => {
            component.updatePayment('isNewUserPayWithCreditCard');
            expect(setApplePayFlowStub).toHaveBeenCalledTimes(1);
        });

        it('should call OrderActions.orderReviewIsActive once', () => {
            component.updatePayment('isNewUserPayWithCreditCard');
            expect(orderReviewIsActiveStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('Update Security Code', () => {
        beforeEach(() => {
            const wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.updateSecurityCode('123');
        });

        it('should update state', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                securityCode: '123'
            });
        });
    });

    describe('Set New Credit Card', () => {
        let cleanCreditCardDataStub;
        let creditCardData;

        beforeEach(() => {
            creditCardData = {
                creditCardId: 'pc1235132'
            };
            cleanCreditCardDataStub = spyOn(creditCardUtils, 'cleanCreditCardData');
            const wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.setNewCreditCard(creditCardData);
        });

        it('should call creditCardUtils.cleanCreditCardData', () => {
            expect(cleanCreditCardDataStub).toHaveBeenCalledTimes(1);
        });

        it('should update state', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                selectedCreditCardId: creditCardData.creditCardId,
                isPayWithPayPal: false,
                isPayWithApplePay: false,
                securityCode: ''
            });
        });
    });

    describe('Show Add Credit Card Form', () => {
        let e;

        beforeEach(() => {
            e = {
                preventDefault: createSpy()
            };
            props = {
                creditCardOptions: [{}, {}],
                shippingAddress: { address1: 'address1' }
            };
            const wrapper = shallow(<PaymentSectionExistingUser {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.showAddCreditCardForm(e);
        });

        it('should call e.preventDefault once', () => {
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should update state', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    openCreditCardForm: true,
                    isUseShipAddressAsBilling: true
                },
                any(Function)
            );
        });
    });

    describe('Show Edit Credit Card Form', () => {
        let isShipAddressBillingAddressStub;
        let formatExpMonthStub;
        let formatExpYearStub;
        let creditCardInfo;

        beforeEach(() => {
            creditCardInfo = {
                cardType: 'VISA',
                expirationMonth: '1',
                expirationYear: '2020'
            };
            isShipAddressBillingAddressStub = spyOn(creditCardUtils, 'isShipAddressBillingAddress').and.returnValue(true);
            formatExpYearStub = spyOn(creditCardUtils, 'formatExpYear').and.callFake(arg0 => arg0);
            formatExpMonthStub = spyOn(creditCardUtils, 'formatExpMonth').and.callFake(arg0 => arg0);
            const wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            component.showEditCreditCardForm(creditCardInfo);
        });

        it('should call formatExpMonth once', () => {
            expect(formatExpMonthStub).toHaveBeenCalledTimes(1);
        });

        it('should call formatExpYear once', () => {
            expect(formatExpYearStub).toHaveBeenCalledTimes(1);
        });

        it('should call isShipAddressBillingAddress once', () => {
            expect(isShipAddressBillingAddressStub).toHaveBeenCalledTimes(1);
        });

        it('should update state', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    openCreditCardForm: true,
                    editCreditCard: {
                        cardType: 'VISA',
                        expirationMonth: '1',
                        expirationYear: '2020'
                    },
                    isUseShipAddressAsBilling: true
                },
                any(Function)
            );
        });
    });

    describe('Close Credit Card Form', () => {
        let wrapper;

        it('should call setState once and with correct args', () => {
            wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.closeCreditCardForm();

            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                openCreditCardForm: false,
                editCreditCard: null
            });
        });
    });

    describe('Handle Klarna payment click tracking', () => {
        let creditCardData;
        let eventData;
        let processSpy;

        beforeEach(() => {
            creditCardData = {
                creditCardId: 'pc1235132'
            };
            processSpy = spyOn(processEvent, 'process');

            const wrapper = shallow(<PaymentSectionExistingUser />);
            component = wrapper.instance();
        });

        it('should call process Link tracking event with Klarna', () => {
            eventData = {
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: 'D=c55',
                actionInfo: 'checkout:payment:klarna'
            };

            component.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.KLARNA)();

            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: eventData });
        });

        it('should call process Link tracking event with Afterpay', () => {
            eventData = {
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: 'D=c55',
                actionInfo: 'checkout:payment:afterpay'
            };

            component.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY)();

            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: eventData });
        });
    });
});
