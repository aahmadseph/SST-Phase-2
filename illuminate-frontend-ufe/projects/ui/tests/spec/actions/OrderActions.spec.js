const {
    GIFT_CARD_APPLIED,
    ORDER_ERRORS,
    ORDER_REVIEW_TOGGLE,
    PAYMENT_CARD_NUMBER_CHANGED,
    PAYMENT_CARDS_DETECTED,
    SECTION_SAVED,
    SET_PLACE_ORDER_PRE_HOOK,
    SUBMITTED_ORDER,
    TOGGLE_CVC_INFO_MODAL,
    TOGGLE_PLACE_ORDER,
    UPDATE_ORDER,
    UPDATE_SHIPPING_METHODS,
    VALIDATE_ADDRESS
} = require('constants/actionTypes/order');

describe('OrderActions', () => {
    const Actions = require('actions/OrderActions').default;
    let result;

    describe('updateOrder', () => {
        const orderDetails = { myOrderDetailsKey: 'my order details value' };

        beforeEach(() => {
            result = Actions.updateOrder(orderDetails);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(UPDATE_ORDER);
        });

        it('should set order details', () => {
            expect(result.orderDetails).toEqual(orderDetails);
        });
    });

    describe('orderSubmitted', () => {
        const submittedDetails = { mySubmittedDetailsKey: 'my submitted details value' };

        beforeEach(() => {
            result = Actions.orderSubmitted(submittedDetails);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(SUBMITTED_ORDER);
        });

        it('should set the submitted details', () => {
            expect(result.submittedDetails).toEqual(submittedDetails);
        });
    });

    describe('togglePlaceOrderDisabled', () => {
        beforeEach(() => {
            result = Actions.togglePlaceOrderDisabled(true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(TOGGLE_PLACE_ORDER);
        });

        it('should disable the placer order button', () => {
            expect(result.isPlaceOrderDisabled).toBeTruthy();
        });

        it('should enable the placer order button', () => {
            result = Actions.togglePlaceOrderDisabled(false);
            expect(result.isPlaceOrderDisabled).toBeFalsy();
        });
    });

    describe('orderErrors', () => {
        const orderErrors = [{}];

        beforeEach(() => {
            result = Actions.orderErrors(orderErrors);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(ORDER_ERRORS);
        });

        it('should set order errors', () => {
            expect(result.orderErrors).toEqual(orderErrors);
        });
    });

    describe('sectionSaved', () => {
        const section = 'my section';
        const component = 'my component';

        beforeEach(() => {
            result = Actions.sectionSaved(section, component, true, true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(SECTION_SAVED);
        });

        it('should set section', () => {
            expect(result.section).toEqual(section);
        });

        it('should set the component', () => {
            expect(result.component).toEqual(component);
        });

        it('should set the update order as true', () => {
            expect(result.isUpdateOrder).toBeTruthy();
        });

        it('should set payment section complete as true', () => {
            expect(result.isPaymentSectionComplete).toBeTruthy();
        });

        it('should set the update order as false', () => {
            result = Actions.sectionSaved(section, component, false);
            expect(result.isUpdateOrder).toBeFalsy();
        });

        it('should set payment section complete as false', () => {
            result = Actions.sectionSaved(section, component, false, false);
            expect(result.isPaymentSectionComplete).toBeFalsy();
        });
    });

    describe('orderReviewIsActive', () => {
        beforeEach(() => {
            result = Actions.orderReviewIsActive(true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(ORDER_REVIEW_TOGGLE);
        });

        it('should set the section as active ', () => {
            expect(result.isActive).toBeTruthy();
        });

        it('should set the section as inactive ', () => {
            result = Actions.orderReviewIsActive(false);
            expect(result.isActive).toBeFalsy();
        });
    });

    describe('paymentCardNumberChanged', () => {
        const cardNumber = '4111111111111111';
        beforeEach(() => {
            result = Actions.paymentCardNumberChanged(cardNumber);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(PAYMENT_CARD_NUMBER_CHANGED);
        });

        it('should set the card number', () => {
            expect(result.cardNumber).toEqual(cardNumber);
        });
    });

    describe('paymentCardsDetected', () => {
        const cardTypes = ['', ''];

        beforeEach(() => {
            result = Actions.paymentCardsDetected(cardTypes);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(PAYMENT_CARDS_DETECTED);
        });

        it('should set the card types', () => {
            expect(result.cardTypes).toEqual(cardTypes);
        });
    });

    describe('updateShippingMethods', () => {
        const shippingMethods = ['', ''];
        const shippingGroup = ['', '', ''];

        beforeEach(() => {
            result = Actions.updateShippingMethods(['', '', ''], ['', '']);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(UPDATE_SHIPPING_METHODS);
        });

        it('should set the shipping methods', () => {
            result = Actions.updateShippingMethods(shippingMethods, ['', '']);
            expect(result.shippingMethods).toEqual(shippingMethods);
        });

        it('should set the shipping group', () => {
            result = Actions.updateShippingMethods(['', '', ''], shippingGroup);
            expect(result.shippingGroup).toEqual(shippingGroup);
        });
    });

    describe('validateAddress', () => {
        const addressId = 3;

        beforeEach(() => {
            result = Actions.validateAddress(1);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(VALIDATE_ADDRESS);
        });

        it('should set the address id', () => {
            result = Actions.validateAddress(addressId);
            expect(result.addressId).toEqual(addressId);
        });
    });

    describe('showCVCInfoModal', () => {
        beforeEach(() => {
            result = Actions.showCVCInfoModal(true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(TOGGLE_CVC_INFO_MODAL);
        });

        it('should open the modal', () => {
            expect(result.isOpen).toBeTruthy();
        });

        it('should close the modal', () => {
            result = Actions.showCVCInfoModal(false);
            expect(result.isOpen).toBeFalsy();
        });
    });

    describe('setPlaceOrderPreHook', () => {
        const preHookPromise = new Promise(() => {});

        beforeEach(() => {
            result = Actions.setPlaceOrderPreHook(preHookPromise);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(SET_PLACE_ORDER_PRE_HOOK);
        });

        it('should set placeOrderPreHook as ', () => {
            expect(result.placeOrderPreHook).toEqual(preHookPromise);
        });
    });

    describe('giftCardApplied', () => {
        beforeEach(() => {
            result = Actions.giftCardApplied();
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(GIFT_CARD_APPLIED);
        });
    });
});
