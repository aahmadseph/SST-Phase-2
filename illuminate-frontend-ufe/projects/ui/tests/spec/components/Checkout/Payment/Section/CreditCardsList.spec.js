/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const { CHECKOUT_CC_MESSAGING } = require('constants/TestTarget');

describe('CreditCardsList component', () => {
    let store;
    let OrderUtils;
    let userUtils;
    let profileApi;
    let checkoutApi;
    let creditCardUtils;
    let CreditCardsList;
    let CheckoutUtils;
    let ErrorsUtils;
    let component;
    let props;

    beforeEach(() => {
        store = require('Store').default;
        OrderUtils = require('utils/Order').default;
        userUtils = require('utils/User').default;
        profileApi = require('services/api/profile').default;
        checkoutApi = require('services/api/checkout').default;
        creditCardUtils = require('utils/CreditCard').default;
        CreditCardsList = require('components/Checkout/Sections/Payment/Section/CreditCardsList/CreditCardsList').default;
        CheckoutUtils = require('utils/Checkout').default;
        ErrorsUtils = require('utils/Errors').default;
    });

    describe('ctrlr', () => {
        let setNewCreditCardStub;
        let creditCardInfoStub;
        let isPaymentInOrderCompleteStub;

        beforeEach(() => {
            isPaymentInOrderCompleteStub = spyOn(CheckoutUtils, 'isPaymentInOrderComplete');

            setNewCreditCardStub = createSpy();
            creditCardInfoStub = {
                creditCardInfo: 'info',
                isDefault: true
            };
        });

        describe('with selected card', () => {
            let validateErrorStub;
            let collectClientFieldErrorsStub;
            let validateStub;

            beforeEach(function () {
                props = {
                    selectedCreditCardId: '123',
                    setNewCreditCard: setNewCreditCardStub,
                    cards: [creditCardInfoStub]
                };
                validateErrorStub = createSpy();
                const wrapper = shallow(<CreditCardsList {...props} />);
                component = wrapper.instance();
                component.refs = { securityCodeInput: 'securityCodeInput' };
                collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors');
                validateStub = spyOn(ErrorsUtils, 'validate');
                component.componentDidMount();
            });

            it('should not call setNewCreditCard since card is already selected', () => {
                expect(setNewCreditCardStub).not.toHaveBeenCalled();
            });

            it('should immediately validate CVV when component is ready', () => {
                component.componentDidUpdate();
                expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(['securityCodeInput']);
            });

            it('should show the error on CVV if field is empty', () => {
                component.componentDidUpdate();
                expect(validateStub).toHaveBeenCalledTimes(1);
            });
        });

        describe('without selected card, but has default card', () => {
            beforeEach(function () {
                props = {
                    selectedCreditCardId: null,
                    setNewCreditCard: setNewCreditCardStub,
                    cards: [creditCardInfoStub]
                };
                const wrapper = shallow(<CreditCardsList {...props} />);
                component = wrapper.instance();
                component.componentDidMount();
            });

            it('should call isPaymentInOrderComplete once', () => {
                expect(isPaymentInOrderCompleteStub).toHaveBeenCalled();
            });

            it('should call setNewCreditCard for default card', () => {
                expect(setNewCreditCardStub).toHaveBeenCalledWith(creditCardInfoStub);
            });
        });
    });

    describe('showCVCInput', () => {
        let isPaymentInOrderCompleteStub;
        let getCreditCardPaymentGroupStub;
        let isShippableOrderStub;

        const creditCardStub = {
            creditCardId: '1',
            cardType: 'visa',
            isCardInOrder: false,
            isPreApproved: false
        };
        const preApprovedCreditCardStub = {
            creditCardId: '1',
            cardType: 'visa',
            isCardInOrder: false,
            isPreApproved: true
        };
        const cardInOrderCreditCardStub = {
            creditCardId: '1',
            cardType: 'visa',
            isCardInOrder: true,
            isPreApproved: false
        };

        beforeEach(() => {
            isPaymentInOrderCompleteStub = spyOn(CheckoutUtils, 'isPaymentInOrderComplete');

            getCreditCardPaymentGroupStub = spyOn(OrderUtils, 'getCreditCardPaymentGroup').and.returnValue({});

            isShippableOrderStub = spyOn(OrderUtils, 'isShippableOrder').and.returnValue(true);

            const wrapper = shallow(<CreditCardsList cards={[]} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
        });

        it('should not show cvc when cardId doesnt mactch selectedId', () => {
            expect(component.showCVCInput(creditCardStub, '2')).toBe(false);
        });

        it('should not show cvc if card is pre approved', () => {
            expect(component.showCVCInput(preApprovedCreditCardStub, '1')).toBe(false);
        });

        it('should show cvc if payment is not complete and card is in order', () => {
            isPaymentInOrderCompleteStub.and.returnValue(false);
            expect(component.showCVCInput(cardInOrderCreditCardStub, '1')).toBe(true);
        });

        it('should not show cvc if payment is complete and card is in order', () => {
            isPaymentInOrderCompleteStub.and.returnValue(true);
            expect(component.showCVCInput(cardInOrderCreditCardStub, '1')).toBe(false);
        });
    });

    describe('Remove Order Payment', () => {
        let isSavedToProfileStub;
        let removeOrderPaymentStub;

        beforeEach(() => {
            props = {
                creditCardPaymentGroup: {
                    paymentGroupId: '0'
                },
                cards: []
            };
            isSavedToProfileStub = spyOn(creditCardUtils, 'isSavedToProfile').and.returnValue(false);
            removeOrderPaymentStub = spyOn(checkoutApi, 'removeOrderPayment').and.returnValue(Promise.resolve());
            const wrapper = shallow(<CreditCardsList {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.removeOrderPayment('c12389', 'current');
        });

        it('should call isSavedToProfile once to check if card is saved to users profile', () => {
            expect(isSavedToProfileStub).toHaveBeenCalledTimes(1);
        });

        it('should call removeOrderPayment once with correct args', () => {
            expect(removeOrderPaymentStub.calls.mostRecent().args).toEqual(['current', '0', null]);
        });
    });

    describe('Remove Credit Card', () => {
        let getProfileIdStub;
        let removeCreditCardFromProfileStub;

        beforeEach(() => {
            getProfileIdStub = spyOn(userUtils, 'getProfileId').and.returnValue('123456');
            removeCreditCardFromProfileStub = spyOn(profileApi, 'removeCreditCardFromProfile').and.returnValue(Promise.resolve());

            component = shallow(<CreditCardsList cards={[]} />, { disableLifecycleMethods: true }).instance();
            component.removeCreditCard('c12389', 'current');
        });

        it('should call userUtils.getProfileId once to get users profile id', () => {
            expect(getProfileIdStub).toHaveBeenCalledTimes(1);
        });

        it('should call removeCreditCardFromProfile once with correct args', () => {
            expect(removeCreditCardFromProfileStub.calls.mostRecent().args).toEqual(['123456', 'c12389']);
        });
    });

    describe('Show Remove Credit Card Modal', () => {
        it('should call event.preventDefault once', () => {
            // Arrange
            const event = { preventDefault: createSpy('preventDefault') };
            const wrapper = shallow(<CreditCardsList cards={[]} />, { disableLifecycleMethods: true });

            // Act
            wrapper.instance().showRemoveCreditCardModal({}, event);

            // Assert
            expect(event.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should dispatch showInfoModal action', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            spyOn(CheckoutUtils, 'isPaymentInOrderComplete').and.returnValue(false);
            const event = { preventDefault: createSpy('preventDefault') };
            const wrapper = shallow(<CreditCardsList cards={[]} />);

            // Act
            wrapper.instance().showRemoveCreditCardModal({}, event);

            // Assert
            expect(dispatch).toHaveBeenCalled();
        });
    });
});
