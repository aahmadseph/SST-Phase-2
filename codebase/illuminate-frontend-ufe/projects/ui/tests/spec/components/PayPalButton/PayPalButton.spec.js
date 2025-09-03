const React = require('react');
const { any, createSpy, objectContaining } = jasmine;
const { shallow } = require('enzyme');

describe('PayPalButton components', () => {
    let store;
    let PayPal;
    let addToBasketActions;
    let basketUtils;
    let userUtils;
    let checkoutApi;
    let PayPalButton;
    let checkoutUtils;
    let component;
    let resolvedPromise;
    let initOrderSuccessStub;

    beforeEach(() => {
        store = require('Store').default;
        PayPal = require('utils/PayPal').default;
        addToBasketActions = require('actions/AddToBasketActions').default;
        basketUtils = require('utils/Basket').default;
        userUtils = require('utils/User').default;
        checkoutApi = require('services/api/checkout').default;
        PayPalButton = require('components/PayPalButton/PayPalButton').default;
        checkoutUtils = require('utils/Checkout').default;

        initOrderSuccessStub = spyOn(checkoutUtils, 'initOrderSuccess');
        spyOn(store, 'getState').and.returnValue({
            basket: {
                items: [],
                showPaypalPopUp: true,
                error: { orderMergedMsg: null }
            }
        });
        spyOn(store, 'dispatch');
        spyOn(PayPal, 'preparePaypalCheckout');
        resolvedPromise = Promise.resolve({});
        spyOn(checkoutApi, 'initializePayPalCheckout').and.returnValue(resolvedPromise);

        const props = { isPaypalPayment: PayPal.TYPES.ENABLED };
        component = shallow(<PayPalButton {...props} />).instance();
    });

    it('should not render when isPaypalPayment === "HIDDEN"', () => {
        // Arrange
        const props = { isPaypalPayment: PayPal.TYPES.HIDDEN };

        // Act
        const wrapper = shallow(<PayPalButton {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it('should render when isPaypalPayment === "DISABLED"', () => {
        // Arrange
        const props = { isPaypalPayment: PayPal.TYPES.DISABLED };

        // Act
        const wrapper = shallow(<PayPalButton {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeFalsy();
    });

    it('should render when isPaypalPayment === "ENABLED"', () => {
        // Arrange
        const props = { isPaypalPayment: PayPal.TYPES.ENABLED };

        // Act
        const wrapper = shallow(<PayPalButton {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toBeFalsy();
    });

    it('should prepare Paypal Checkout', () => {
        expect(PayPal.preparePaypalCheckout).toHaveBeenCalledTimes(1);
    });

    describe('Checkout With PayPal', () => {
        let payloadStub;

        beforeEach(() => {
            payloadStub = {};
            spyOn(PayPal, 'showPayPal').and.callFake(callback => callback({}));

            spyOn(basketUtils, 'isOnlySamplesRewardsInBasket');
            component.goToCheckout = createSpy('goToCheckout');
        });

        describe('Standard Goods Available', () => {
            beforeEach(() => {
                basketUtils.isOnlySamplesRewardsInBasket.and.returnValue(false);
            });

            it('should check if there is not only samples and rewards > 750', () => {
                component.checkoutWithPayPal();
                expect(basketUtils.isOnlySamplesRewardsInBasket).toHaveBeenCalledWith(true, undefined);
            });

            it('should show Paypal Flow', () => {
                component.checkoutWithPayPal();
                expect(PayPal.showPayPal).toHaveBeenCalledWith(any(Function));
            });

            it('should initialize PayPal checkout', () => {
                component.checkoutWithPayPal();
                expect(checkoutApi.initializePayPalCheckout).toHaveBeenCalledWith(payloadStub);
            });
        });

        describe('No Standard Goods Available', () => {
            beforeEach(() => {
                spyOn(addToBasketActions, 'showError');
                basketUtils.isOnlySamplesRewardsInBasket.and.returnValue(true);
                spyOn(userUtils, 'isAnonymous').and.returnValue(false);
                component.checkoutWithPayPal();
            });

            it('should dispatch an action for basket action', () => {
                expect(store.dispatch).toHaveBeenCalled();
            });

            it('should call basket show error function', () => {
                expect(addToBasketActions.showError).toHaveBeenCalledTimes(1);
            });

            it('should call basket error function with error object', () => {
                const errorObj = { internalError: 'You must add merchandise before you can proceed to checkout.' };
                expect(addToBasketActions.showError).toHaveBeenCalledWith(errorObj);
            });
        });
    });

    describe('goToCheckout', () => {
        /*
            FIXME:
            These tests are failing because some spyOn are not
            mocking the original functions properly causing a
            "Some of your tests did a full page reload!" error
        */
        it('should initialize checkout for the PayPal flow', async () => {
            // Arrange
            const initializeCheckoutStub = spyOn(checkoutUtils, 'initializeCheckout').and.callFake(() => ({ then: () => ({ catch: () => {} }) }));

            // Act
            await component.goToCheckout();

            // Assert
            expect(initializeCheckoutStub).toHaveBeenCalledWith(objectContaining({ isPaypalFlow: true }));
        });

        it('should invoke checkoutUtils.initOrderSuccess when succeeds', async () => {
            // Arrange
            spyOn(checkoutUtils, 'initializeCheckout').and.resolveTo();

            // Act
            await component.goToCheckout();

            // Assert
            expect(initOrderSuccessStub).toHaveBeenCalledWith(true, undefined);
        });

        it('should invoke checkoutUtils.initOrderFailure when fails', async () => {
            // Arrange
            const initOrderFailure = spyOn(checkoutUtils, 'initOrderFailure');
            const error = { shouldBeObjectHere: true };
            spyOn(checkoutUtils, 'initializeCheckout').and.rejectWith(error);

            // Act
            await component.goToCheckout();

            // Assert
            expect(initOrderFailure).toHaveBeenCalledWith(error);
        });
    });
});
