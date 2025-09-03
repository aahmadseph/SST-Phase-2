/* eslint-disable no-unused-vars */
/* eslint camelcase: 0 */
const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;

describe('PlaceOrderButton component', () => {
    const order = {
        orderDetails: {
            header: {
                isComplete: false,
                isPaypalPaymentEnabled: false
            },
            items: { itemCount: 4 },
            priceInfo: { orderTotal: 10.0 }
        },
        paymentOptions: {},
        isPlaceOrderDisabled: true,
        isApplyPayFlow: false
    };

    let setAndWatch;
    let setAndWatchStub;
    let setStateStub;
    let component;
    let wrapper;
    let getNonPromoItemsCountStub;
    let userHasSavedPaypalAccountStub;
    let dispatchStub;
    let store;
    let OrderActions;
    let UtilActions;
    let decorators;
    let Storage;
    let LOCAL_STORAGE;
    let ERROR_CODES;
    let PlaceOrderButton;
    let Location;
    let OrderUtils;
    let INTERSTICE_DELAY_MS;
    let checkoutApi;
    let beautyInsiderApi;
    let togglePlaceOrderDisabledStub;
    let removeItemStub;
    let ErrorsUtils;

    const setAndWatchStubCallbacks = [];

    beforeEach(() => {
        store = require('Store').default;
        OrderActions = require('actions/OrderActions').default;
        UtilActions = require('utils/redux/Actions').default;
        decorators = require('utils/decorators').default;
        Storage = require('utils/localStorage/Storage').default;
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;
        ERROR_CODES = require('utils/ErrorConstants').default.ERROR_CODES;
        PlaceOrderButton = require('components/Checkout/PlaceOrderButton/PlaceOrderButton').default;
        Location = require('utils/Location').default;
        OrderUtils = require('utils/Order').default;
        INTERSTICE_DELAY_MS = require('components/Checkout/constants').INTERSTICE_DELAY_MS;
        checkoutApi = require('services/api/checkout').default;
        beautyInsiderApi = require('services/api/beautyInsider').default;
        ErrorsUtils = require('utils/Errors').default;
        setAndWatch = store.setAndWatch;
        setAndWatchStub = spyOn(store, 'setAndWatch');
        setAndWatchStub.and.callFake((...args) => {
            if (args[0] && args[0].indexOf('order') === 0 && typeof args[2] === 'function') {
                setAndWatchStubCallbacks.push(args[2]);
            }
        });
        getNonPromoItemsCountStub = spyOn(OrderUtils, 'getNonPromoItemsCount');
        getNonPromoItemsCountStub.and.returnValue(10);
        userHasSavedPaypalAccountStub = spyOn(OrderUtils, 'userHasSavedPayPalAccount');
        userHasSavedPaypalAccountStub.and.returnValue(false);
        dispatchStub = spyOn(store, 'dispatch');
        togglePlaceOrderDisabledStub = spyOn(OrderActions, 'togglePlaceOrderDisabled');
        removeItemStub = spyOn(Storage.local, 'removeItem');
    });

    describe('the controller', function () {
        beforeEach(() => {
            wrapper = shallow(<PlaceOrderButton />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        describe('should set and watch', () => {
            it('depending on is place order disabled info from store', () => {
                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('order.isPlaceOrderDisabled', component, any(Function));
                setAndWatchStubCallbacks.forEach(f => f(order));
                expect(setStateStub).toHaveBeenCalledWith({ disabled: order.isPlaceOrderDisabled });
            });

            it('depending on order details from store', () => {
                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
                setAndWatchStubCallbacks.forEach(f => f(order));
                expect(setStateStub).toHaveBeenCalledWith({
                    orderQuantity: order.orderDetails.items.itemCount,
                    orderTotal: order.orderDetails.priceInfo.orderTotal,
                    isPaypalPaymentEnabled: order.orderDetails.header.isPaypalPaymentEnabled,
                    userHasSavedPayPalAccount: false,
                    isAddressMisMatch: order.orderDetails.header.isAddressMisMatch,
                    digitalGiftMsg: order.orderDetails.digitalGiftMsg,
                    maxAmountToBeAuthorized: order.orderDetails.priceInfo.maxAmountToBeAuthorized
                });
            });

            it('depending on Apple Pay Flow from store', function () {
                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('order.isApplePayFlow', component, null, true);
            });

            it('sets disabled state based on is place order disabled info from store', () => {
                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('order.isPlaceOrderDisabled', component, any(Function));
                setAndWatchStubCallbacks.forEach(f => f(order));
                expect(setStateStub).toHaveBeenCalledWith({ disabled: order.isPlaceOrderDisabled });
            });

            it('sets state depending on order details from store', () => {
                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
                setAndWatchStubCallbacks.forEach(f => f(order));
                expect(setStateStub).toHaveBeenCalledWith({
                    orderQuantity: order.orderDetails.items.itemCount,
                    orderTotal: order.orderDetails.priceInfo.orderTotal,
                    isPaypalPaymentEnabled: order.orderDetails.header.isPaypalPaymentEnabled,
                    userHasSavedPayPalAccount: false,
                    isAddressMisMatch: order.orderDetails.header.isAddressMisMatch,
                    digitalGiftMsg: order.orderDetails.digitalGiftMsg,
                    maxAmountToBeAuthorized: order.orderDetails.priceInfo.maxAmountToBeAuthorized
                });
            });
        });
    });

    describe('is successful', function () {
        let orderSubmittedStub;

        const submittedDetails = { orderId: 123456 };

        beforeEach(() => {
            orderSubmittedStub = spyOn(OrderActions, 'orderSubmitted');
            wrapper = shallow(<PlaceOrderButton />);
            component = wrapper.instance();
        });

        it('should dispatch order action that order is submitted', function () {
            component.onPlaceOrderSuccess(submittedDetails);
            expect(dispatchStub).toHaveBeenCalled();
        });

        it('should remove local storage user and basket data', function () {
            component.onPlaceOrderSuccess(submittedDetails);
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.BASKET);
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.USER_DATA);
        });

        it('should redirect to order confirmation page for all other orders', function () {
            component.onPlaceOrderSuccess(submittedDetails);
            expect(Location.setLocation).toHaveBeenCalledWith('/checkout/confirmation?orderId=123456');
        });
    });

    describe('has failed', function () {
        let errorData;
        let collectAndValidateBackEndErrorsStub;
        let orderErrorsStub;
        let mergeStub;

        beforeEach(function () {
            errorData = {};
            collectAndValidateBackEndErrorsStub = spyOn(ErrorsUtils, 'collectAndValidateBackEndErrors');
            orderErrorsStub = spyOn(OrderActions, 'orderErrors');
            mergeStub = spyOn(UtilActions, 'merge');
            wrapper = shallow(<PlaceOrderButton />);
            component = wrapper.instance();
        });

        it('should dispatch order action to disable place order button', function () {
            component.onPlaceOrderFailure(errorData);
            expect(dispatchStub).toHaveBeenCalledWith(togglePlaceOrderDisabledStub());
        });

        it('should remove basket from local storage if there are out of stock items', function () {
            errorData.errorMessages = ['outOfStock'];
            component.onPlaceOrderFailure(errorData);
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.BASKET);
        });

        it('should redirect user to basket if there are out of stock items', function () {
            errorData.errorMessages = ['outOfStock'];
            component.onPlaceOrderFailure(errorData);
            expect(Location.setLocation).toHaveBeenCalledWith('/basket');
        });

        it('should collect and validate back end errors if there are no out of stock items', function () {
            component.onPlaceOrderFailure(errorData);
            expect(collectAndValidateBackEndErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should dispatch an action to take care of order errors', function () {
            component.onPlaceOrderFailure(errorData);
            expect(dispatchStub).toHaveBeenCalledWith(orderErrorsStub());
        });
    });

    xdescribe('placeKlarnaOrder', function () {
        let Actions;
        let klarnaUtils;
        let getStateStub;
        let authorizeStub;
        let placeOrderStub;
        let processPlaceOrderClickEventStub;
        let showIntersticeStub;

        const klarnaSuccessResponse = {
            show_form: true,
            approved: true,
            authorization_token: '120'
        };
        const klarnaNoTokenResponse = {
            show_form: true,
            approved: false
        };

        beforeEach(() => {
            Actions = require('Actions').default;
            klarnaUtils = require('utils/Klarna').default;

            wrapper = shallow(<PlaceOrderButton />);
            component = wrapper.instance();
            placeOrderStub = spyOn(component, 'placeOrder');
            processPlaceOrderClickEventStub = spyOn(component, 'processPlaceOrderClickEvent');

            showIntersticeStub = spyOn(Actions, 'showInterstice');
            showIntersticeStub.and.callFake(arg => (arg ? 'SHOW_ACTION' : 'HIDE_ACTION'));
            getStateStub = spyOn(store, 'getState').and.returnValue({
                order: order,
                klarna: { useMyShippingAddress: true }
            });
            authorizeStub = spyOn(klarnaUtils, 'authorize').and.returnValue(Promise.resolve(klarnaNoTokenResponse));
            dispatchStub.calls.reset();
        });

        it('should dispatch showInterstice action with true', () => {
            component.placeKlarnaOrder();
            expect(dispatchStub.calls.first().args[0]).toEqual('SHOW_ACTION');
        });

        it('should call authorize with correct args', () => {
            component.placeKlarnaOrder();
            expect(authorizeStub).toHaveBeenCalledWith(order.orderDetails, true);
        });

        it('should call authorize with correct args', () => {
            component.placeKlarnaOrder();
            expect(processPlaceOrderClickEventStub).toHaveBeenCalledWith('checkout:payment:continue with klarna');
        });

        it('should call placeOrder if authorization_token is present', () => {
            const promise = Promise.resolve(klarnaSuccessResponse);
            authorizeStub.and.returnValue(promise);
            component.placeKlarnaOrder({ type: 'click' });
            promise.then(() => {
                expect(placeOrderStub).toHaveBeenCalledWith({ type: 'click' }, klarnaSuccessResponse);
            });
        });

        describe('if authorization_token is missing', () => {
            let promise;
            beforeEach(() => {
                promise = Promise.resolve(klarnaNoTokenResponse);
                authorizeStub.and.returnValue(promise);
                component.placeKlarnaOrder({ type: 'click' });
            });

            it('should not call placeOrder', () => {
                promise.then(() => {
                    expect(placeOrderStub).not.toHaveBeenCalled();
                });
            });

            it('should dispatch showInterstice action with false', () => {
                promise.then(() => {
                    expect(dispatchStub.calls.argsFor(1)[0]).toEqual('HIDE_ACTION');
                });
            });
        });

        describe('on auth denial', () => {
            let promise;
            let KlarnaActions;
            beforeEach(() => {
                KlarnaActions = require('actions/KlarnaActions').default;
                spyOn(KlarnaActions, 'showError').and.callFake(arg0 => arg0);
                // eslint-disable-next-line prefer-promise-reject-errors
                promise = Promise.reject({ type: klarnaUtils.ERROR_TYPES.AUTH_DENIAL });
                authorizeStub.and.returnValue(promise);
                component.placeKlarnaOrder({ type: 'click' });
            });

            it('should not call placeOrder', () => {
                promise.catch().then(() => {
                    expect(placeOrderStub).not.toHaveBeenCalled();
                });
            });

            it('should dispatch showInterstice action with false', () => {
                promise.catch().then(() => {
                    expect(dispatchStub.calls.argsFor(1)[0]).toEqual('HIDE_ACTION');
                });
            });

            it('should dispatch denial error', () => {
                promise.catch().then(() => {
                    expect(dispatchStub).toHaveBeenCalledWith(
                        'We’re sorry! Klarna payment could not be authorized. Please select a different payment method.'
                    );
                });
            });
        });

        describe('on exception', () => {
            let promise;
            let KlarnaActions;
            beforeEach(() => {
                KlarnaActions = require('actions/KlarnaActions').default;
                spyOn(KlarnaActions, 'showError').and.callFake(arg0 => arg0);
                // eslint-disable-next-line prefer-promise-reject-errors
                promise = Promise.reject({ type: klarnaUtils.ERROR_TYPES.AUTH_ERROR });
                authorizeStub.and.returnValue(promise);
                component.placeKlarnaOrder({ type: 'click' });
            });

            it('should not call placeOrder', () => {
                promise.then(() => {
                    expect(placeOrderStub).not.toHaveBeenCalled();
                });
            });

            it('should dispatch showInterstice action with false', () => {
                promise.then(() => {
                    expect(dispatchStub.calls.argsFor(1)[0]).toEqual('HIDE_ACTION');
                });
            });

            it('should dispatch denial error', () => {
                promise.then(() => {
                    expect(dispatchStub).toHaveBeenCalledWith(
                        'Trouble connecting to Klarna. Please use a different payment method or try again later.'
                    );
                });
            });
        });
    });
});
