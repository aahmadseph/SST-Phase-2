describe('Checkout Utils', function () {
    let checkoutUtils;
    let store;
    let basketUtils;
    // let decorators;
    // let userUtils;
    let urlUtils;
    let uiUtils;
    let addToBasketActions;
    let processEvent;
    // let anaConstants;
    let HistoryLocationActions;
    let orderUtils;
    let OrderActions;

    beforeEach(function () {
        checkoutUtils = require('utils/Checkout').default;
        store = require('Store').default;
        basketUtils = require('utils/Basket').default;
        // decorators = require('utils/decorators').default;
        // userUtils = require('utils/User').default;
        urlUtils = require('utils/Url').default;
        uiUtils = require('utils/UI').default;
        addToBasketActions = require('actions/AddToBasketActions').default;
        processEvent = require('analytics/processEvent').default;
        // anaConstants = require('analytics/constants').default;
        HistoryLocationActions = require('actions/framework/HistoryLocationActions').default;
        orderUtils = require('utils/Order').default;
        OrderActions = require('actions/OrderActions').default;
    });

    // describe('Initialize checkout', function () {
    //     let user;
    //     let initializeAnonymousCheckoutStub;
    //     let initializeCheckoutStub;
    //     let profileId;
    //     let orderId;

    //     beforeEach(function () {
    //         user = { userName: 'someUser' };
    //         orderId = 'current';
    //         profileId = 'someProfile';
    //         spyOn(decorators, 'withInterstice').and.callFake(arg => arg);
    //         spyOn(store, 'getState').and.returnValue({ user: user });
    //         initializeCheckoutStub = spyOn(checkoutUtils, 'initializeSignedInCheckout').and.returnValue(Promise.resolve());
    //         initializeAnonymousCheckoutStub = spyOn(checkoutUtils, 'initializeAnonymousCheckout').and.returnValue(Promise.resolve());
    //         spyOn(basketUtils, 'getOrderId').and.returnValue(orderId);
    //         spyOn(userUtils, 'getProfileId').and.returnValue(profileId);
    //     });

    //     const getData = isAnonym => {
    //         return !isAnonym
    //             ? {
    //                 orderId: orderId,
    //                 profileId: profileId,
    //                 isPaypalFlow: false,
    //                 isApplePayFlow: false
    //             }
    //             : {
    //                 email: user.userName,
    //                 isPaypalFlow: false,
    //                 isApplePayFlow: false
    //             };
    //     };

    //     using('User status', [true, false], config => {
    //         it('should init checkout if user is ' + (config ? 'anonymous' : 'existing') + ' via params', function () {
    //             user.isNewUserFlow = config;
    //             spyOn(checkoutUtils, 'initializeCheckout').and.returnValue({
    //                 then: function (resolve) {
    //                     resolve();
    //                     expect(config ? initializeAnonymousCheckoutStub : initializeCheckoutStub).toHaveBeenCalled();
    //                 }
    //             });
    //             checkoutUtils.initializeCheckout({ user });
    //         });

    //         it('should init checkout if user is ' + (config ? 'anonymous' : 'existing') + ' via store', function () {
    //             user.isNewUserFlow = config;
    //             spyOn(checkoutUtils, 'initializeCheckout').and.returnValue({
    //                 then: function (resolve) {
    //                     resolve();
    //                     expect(config ? initializeAnonymousCheckoutStub : initializeCheckoutStub).toHaveBeenCalled();
    //                 }
    //             });
    //             checkoutUtils.initializeCheckout();
    //         });
    //     });

    //     it('should pass paypal and applepay flags', function () {
    //         const initData = {
    //             isPaypalFlow: true,
    //             isApplePayFlow: true
    //         };
    //         spyOn(checkoutUtils, 'initializeCheckout').and.returnValue({
    //             then: function (resolve) {
    //                 resolve();
    //                 expect(initializeCheckoutStub).toHaveBeenCalledWith(Object.assign(getData(), initData));
    //             }
    //         });
    //         checkoutUtils.initializeCheckout(initData);
    //     });

    //     it('should return promise', function (done) {
    //         expect(checkoutUtils.initializeCheckout() instanceof Promise).toBeTruthy();
    //         done();
    //     });
    // });

    describe('Init Order Success', function () {
        let basket, errors, scrollToTopStub, unlockBackgroundPositionStub;

        beforeEach(function () {
            basket = {};
            errors = {};
            spyOn(store, 'getState').and.returnValue({
                basket,
                errors
            });
            spyOn(urlUtils, 'redirectTo');
            scrollToTopStub = spyOn(uiUtils, 'scrollToTop');
            unlockBackgroundPositionStub = spyOn(uiUtils, 'unlockBackgroundPosition');
        });

        afterEach(function () {
            checkoutUtils.setOrderMergedMsgViewed(false);
        });

        it('should not go to checkout if merge basket message is present', function () {
            basket.error = { orderMergedMsg: true };
            checkoutUtils.initOrderSuccess();
            expect(urlUtils.redirectTo).not.toHaveBeenCalled();
        });

        it('should scroll top if merge basket message is present', function () {
            basket.error = { orderMergedMsg: true };
            checkoutUtils.initOrderSuccess();
            expect(scrollToTopStub).toHaveBeenCalled();
        });

        it('should unlock background position if merge basket message is present', function () {
            basket.error = { orderMergedMsg: true };
            checkoutUtils.initOrderSuccess();
            expect(unlockBackgroundPositionStub).toHaveBeenCalled();
        });
    });

    describe('init Order failure', function () {
        let itemLevelErrors;
        let showErrorStub;
        let refreshBasketStub;
        let catchItemLevelErrorsStub;
        let reason;
        let dispatchStub;

        beforeEach(function () {
            reason = {};
            catchItemLevelErrorsStub = spyOn(basketUtils, 'catchItemLevelErrors').and.callFake(() => true);
            showErrorStub = spyOn(addToBasketActions, 'showError').and.returnValue('showBasketError');
            refreshBasketStub = spyOn(addToBasketActions, 'refreshBasket').and.returnValue('refreshBasket');
            spyOn(processEvent, 'process');
            dispatchStub = spyOn(store, 'dispatch');
        });

        it('should catch item level errors', function (done) {
            reason.errors = ['error'];
            checkoutUtils.initOrderFailure(reason);
            expect(catchItemLevelErrorsStub).toHaveBeenCalledWith(reason);
            done();
        });

        it('should not catch malforned errors', function (done) {
            reason = 'string';
            checkoutUtils.initOrderFailure(reason);
            expect(catchItemLevelErrorsStub).not.toHaveBeenCalled();
            done();
        });

        it('should show basket errors', function (done) {
            catchItemLevelErrorsStub.and.callFake(() => false);
            reason.errors = { key: 'There was an error' };
            reason.errorMessages = ['blabla', 'fofofofof'];
            checkoutUtils.initOrderFailure(reason);

            expect(showErrorStub).toHaveBeenCalledWith({ key: reason.errorMessages.join(' ') }, false);
            expect(dispatchStub).toHaveBeenCalledWith('showBasketError');
            done();
        });

        it('should show item level errors', function (done) {
            itemLevelErrors = 'blablabla';
            catchItemLevelErrorsStub.and.callFake(() => itemLevelErrors);
            checkoutUtils.initOrderFailure(reason);
            expect(showErrorStub).toHaveBeenCalledWith(false, itemLevelErrors);
            expect(dispatchStub).toHaveBeenCalledWith('showBasketError');
            done();
        });

        it('should show refresh basket with reason if item level errors exist', function (done) {
            reason.someprop = 'someprop';
            itemLevelErrors = 'blablabla';
            checkoutUtils.initOrderFailure(reason);
            expect(refreshBasketStub).toHaveBeenCalledWith(reason, false);
            expect(dispatchStub).toHaveBeenCalledWith('refreshBasket');
            done();
        });

        it('should show refresh basket with reason if item level error not exist', function (done) {
            catchItemLevelErrorsStub.and.callFake(() => null);
            reason.someprop = 'someprop';
            itemLevelErrors = null;
            checkoutUtils.initOrderFailure(reason);
            expect(refreshBasketStub).toHaveBeenCalledWith(null, false);
            expect(dispatchStub).toHaveBeenCalledWith('refreshBasket');
            done();
        });

        // it('should fire event of failure', function (done) {
        //     const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError').default;

        //     reason.errorMessages = ['someprop'];
        //     checkoutUtils.initOrderFailure(reason);
        //     /* eslint-disable-next-line no-undef */
        //     preCondition(
        //         () => {
        //             if (processStub.calls.count() > 0) {
        //                 expect(processStub).toHaveBeenCalledWith(anaConstants.LINK_TRACKING_EVENT, {
        //                     data: {
        //                         bindingMethods: linkTrackingError,
        //                         errorMessages: reason.errorMessages,
        //                         eventStrings: [anaConstants.Event.EVENT_71],
        //                         linkName: 'error',
        //                         specificEventName: 'basket_checkout_button_error'
        //                     }
        //                 });

        //                 return true;
        //             }

        //             return false;
        //         },
        //         done,
        //         100
        //     );
        // });
    });

    describe('is ship address complete', function () {
        let orderDetails;
        let SHIPPING_GROUPS;

        beforeEach(function () {
            SHIPPING_GROUPS = orderUtils.SHIPPING_GROUPS;
            orderDetails = {
                shippingGroups: {
                    shippingGroupsEntries: [
                        {
                            shippingGroup: { isComplete: true },
                            shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
                        }
                    ]
                }
            };
        });

        it('should be true if the hard goods shipping address is complete', function () {
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails: orderDetails } });
            const result = checkoutUtils.isShipAddressComplete();
            expect(result).toBe(true);
        });

        it('should be false if the hard goods shipping address is incomplete', function () {
            orderDetails.shippingGroups.shippingGroupsEntries[0].shippingGroup.isComplete = false;
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails: orderDetails } });
            const result = checkoutUtils.isShipAddressComplete();
            expect(result).toBe(false);
        });
    });

    describe('is payment complete', function () {
        let orderDetails;

        beforeEach(function () {
            orderDetails = {
                header: { paymentGroups: [] },
                paymentGroups: { paymentGroupsEntries: [] }
            };
            spyOn(orderUtils, 'isSDUOnlyOrder');
            spyOn(orderUtils, 'isZeroDollarOrderWithCVVValidation');
        });

        it('should be true if payments are complete', function () {
            orderDetails.header.paymentGroups.push({ isComplete: true });
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails: orderDetails, paymentOptions: {} } });
            const result = checkoutUtils.isPaymentSectionComplete();
            expect(result).toBe(true);
        });

        it('should be false if payments are incomplete', function () {
            orderDetails.header.paymentGroups.push({ isComplete: false });
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails: orderDetails, paymentOptions: {} } });
            const result = checkoutUtils.isPaymentSectionComplete();
            expect(result).toBe(false);
        });
    });

    describe('is account complete', function () {
        let orderDetails;

        beforeEach(function () {
            orderDetails = { header: { profile: {} } };
        });

        it('should be true if account is complete', function () {
            orderDetails.header.profile.isComplete = true;
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails: orderDetails } });
            const result = checkoutUtils.isAccountComplete();
            expect(result).toBe(true);
        });

        it('should be false if account is incomplete', function () {
            orderDetails.header.profile.isComplete = false;
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails: orderDetails } });
            const result = checkoutUtils.isAccountComplete();
            expect(result).toBe(false);
        });
    });

    describe('Change Checkout Url Based On Order Completeness', function () {
        let goToStub;
        let replaceLocationStub;
        let orderDetails;
        let SHIPPING_GROUPS;
        let dispatchStub;
        let getStateStub;

        beforeEach(function () {
            goToStub = spyOn(HistoryLocationActions, 'goTo');
            replaceLocationStub = spyOn(HistoryLocationActions, 'replaceLocation');
            orderDetails = {
                shippingGroups: { shippingGroupsEntries: [] },
                header: {
                    paymentGroups: [],
                    isComplete: false,
                    profile: { isComplete: false }
                }
            };
            SHIPPING_GROUPS = orderUtils.SHIPPING_GROUPS;
            dispatchStub = spyOn(store, 'dispatch');
            getStateStub = spyOn(store, 'getState');
            spyOn(checkoutUtils, 'isGuestOrder');
            spyOn(orderUtils, 'isSDUOnlyOrder');
            spyOn(orderUtils, 'isZeroDollarOrderWithCVVValidation');
        });

        it('should replace location to ship address for hard goods if it is not ' + 'complete', function () {
            orderDetails.shippingGroups.shippingGroupsEntries.push({
                shippingGroup: { isComplete: false },
                shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
            });
            getStateStub.and.returnValue({
                order: { orderDetails: orderDetails, paymentOptions: {} },
                historyLocation: { path: '/checkout' }
            });
            checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness();
            expect(dispatchStub).toHaveBeenCalledWith(replaceLocationStub());
            expect(replaceLocationStub).toHaveBeenCalledWith({ path: '/checkout/shipping' });
        });

        describe('when shipping address is not verified for AVS and it is checkout first time', () => {
            let togglePlaceOrderDisabledStub;
            beforeEach(() => {
                Sephora.configurationSettings.enableAddressValidation = true;
                orderDetails.shippingGroups.shippingGroupsEntries.push({
                    shippingGroup: {
                        isComplete: true,
                        address: { isAddressVerified: false }
                    },
                    shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
                });
                getStateStub.and.returnValue({
                    order: { orderDetails: orderDetails },
                    historyLocation: { path: '/checkout' }
                });
                togglePlaceOrderDisabledStub = spyOn(OrderActions, 'togglePlaceOrderDisabled');
                checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness(false, false, true);
            });

            it('should call dispatch twice', () => {
                expect(dispatchStub).toHaveBeenCalledTimes(2);
            });

            it('should disable Place Order button', () => {
                expect(togglePlaceOrderDisabledStub).toHaveBeenCalledWith(true);
            });

            it('should replace location to ship address', () => {
                expect(replaceLocationStub).toHaveBeenCalledWith({ path: '/checkout/shipping' });
            });
        });

        it('should replace location to ship options for hard goods if its a new users first ' + 'time', function () {
            orderDetails.shippingGroups.shippingGroupsEntries.push({
                shippingGroup: { isComplete: true },
                shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
            });
            getStateStub.and.returnValue({
                order: { orderDetails: orderDetails },
                historyLocation: { path: '/checkout' }
            });
            checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness(true);
            expect(dispatchStub).toHaveBeenCalledWith(replaceLocationStub());
            expect(replaceLocationStub).toHaveBeenCalledWith({ path: '/checkout/delivery' });
        });

        it('should replace location to payment if it is not complete', function () {
            orderDetails.shippingGroups.shippingGroupsEntries.push({
                shippingGroup: { isComplete: true },
                shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
            });
            orderDetails.header.paymentGroups.push({ isComplete: false });
            getStateStub.and.returnValue({
                order: { orderDetails: orderDetails, paymentOptions: {} },
                historyLocation: { path: '/checkout' }
            });
            checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness();
            expect(dispatchStub).toHaveBeenCalledWith(replaceLocationStub());
            expect(replaceLocationStub).toHaveBeenCalledWith({ path: '/checkout/payment' });
        });

        it(
            'should go to next incomplete section (in this case ship address) if the current path' +
                ' is not /checkout, instead of replacing the state',
            function () {
                orderDetails.shippingGroups.shippingGroupsEntries.push({
                    shippingGroup: { isComplete: false },
                    shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
                });
                getStateStub.and.returnValue({
                    order: { orderDetails: orderDetails },
                    historyLocation: { path: '/checkout/payment' }
                });
                checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness();
                expect(dispatchStub).toHaveBeenCalledWith(goToStub());
                expect(goToStub).toHaveBeenCalledWith({ path: '/checkout/shipping' });
            }
        );

        describe('for a complete order', function () {
            beforeEach(function () {
                orderDetails.shippingGroups.shippingGroupsEntries.push({
                    shippingGroup: { isComplete: true },
                    shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
                });
                orderDetails.header.paymentGroups.push({ isComplete: true });
                orderDetails.header.profile.isComplete = true;
                orderDetails.header.isComplete = true;
                orderDetails.paymentGroups = { paymentGroupsEntries: [] };
            });

            it('should go to review order if order is complete', function () {
                getStateStub.and.returnValue({
                    order: { orderDetails: orderDetails, paymentOptions: {} },
                    historyLocation: { path: '/checkout' }
                });
                checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness();
                expect(dispatchStub).not.toHaveBeenCalled();
                expect(goToStub).not.toHaveBeenCalled();
                expect(replaceLocationStub).not.toHaveBeenCalled();
            });

            it(
                'should replace location with /checkout if order is complete and user enters' +
                    'subsection checkout path (ie /checkout/payment) into browser',
                function () {
                    getStateStub.and.returnValue({
                        order: { orderDetails: orderDetails, paymentOptions: {} },
                        historyLocation: { path: '/checkout/payment' }
                    });
                    checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness();
                    expect(dispatchStub).toHaveBeenCalledWith(replaceLocationStub());
                    expect(replaceLocationStub).toHaveBeenCalledWith({ path: '/checkout' });
                }
            );
        });
    });

    // using(
    //     'Basket item type',
    //     [
    //         {
    //             type: 'flash',
    //             value: orderUtils.SHIPPING_GROUPS.FLASH,
    //             func: orderUtils.isFlashOnlyOrder
    //         }
    //     ],
    //     config => {
    //         describe('is ' + config.type + ' present', function () {
    //             it('should detect it', function (done) {
    //                 expect(
    //                     config.func({
    //                         shippingGroups: {
    //                             shippingGroupsEntries: [{ shippingGroupType: config.value }]
    //                         }
    //                     })
    //                 ).toBeTruthy();
    //                 done();
    //             });

    //             it('should not detect it', function (done) {
    //                 expect(
    //                     config.func({
    //                         shippingGroups: {
    //                             shippingGroupsEntries: [{ shippingGroupType: 'blablala' }]
    //                         }
    //                     })
    //                 ).toBeFalsy();
    //                 done();
    //             });

    //             if (config.value === orderUtils.SHIPPING_GROUPS.FLASH) {
    //                 it('should not detect it', function (done) {
    //                     expect(
    //                         config.func({
    //                             shippingGroups: {
    //                                 shippingGroupsEntries: [{ shippingGroupType: 'blablala' }, { shippingGroupType: config.value }]
    //                             }
    //                         })
    //                     ).toBeFalsy();
    //                     done();
    //                 });
    //             }
    //         });
    //     }
    // );

    describe('is more than just CC', function () {
        it('should be true if priceInfo contains a listed field', function () {
            const result = checkoutUtils.isMoreThanJustCC({ storeCardAmount: '$5.00' });
            expect(result).toBe(true);
        });

        it('should be false if priceInfo contains a listed field', function () {
            const result = checkoutUtils.isMoreThanJustCC({ creditCardAmount: '$5.00' });
            expect(result).toBe(false);
        });
    });

    describe('isZeroFee', () => {
        it('should return true for zero US price', () => {
            expect(checkoutUtils.isZeroFee('$0.00')).toEqual(true);
        });

        it('should return true for zero CA price', () => {
            expect(checkoutUtils.isZeroFee('0,00 $')).toEqual(true);
        });

        it('should not return true for non decimal US price', () => {
            expect(checkoutUtils.isZeroFee('$0')).toEqual(false);
        });

        it('should not return true for malformed price', () => {
            expect(checkoutUtils.isZeroFee('0')).toEqual(false);
        });

        it('should not return true for undefined', () => {
            expect(checkoutUtils.isZeroFee()).toEqual(false);
        });

        it('should not return true for non zero US price', () => {
            expect(checkoutUtils.isZeroFee('$10.00')).toEqual(false);
        });

        it('should not return true for non zero CA price', () => {
            expect(checkoutUtils.isZeroFee('10,00 $')).toEqual(false);
        });

        it('should return true for non zero US free', () => {
            expect(checkoutUtils.isZeroFee('FREE')).toEqual(true);
        });

        it('should return true for non zero US free', () => {
            expect(checkoutUtils.isZeroFee('GRATUIT')).toEqual(true);
        });
    });
});
