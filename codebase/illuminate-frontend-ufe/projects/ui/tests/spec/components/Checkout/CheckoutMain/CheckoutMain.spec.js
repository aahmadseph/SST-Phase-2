/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;

describe('CheckoutMain component', () => {
    const { any } = jasmine;
    let store;
    let checkoutApi;
    let component;
    let wrapper;
    let setAndWatch;
    let setAndWatchStub;
    let Checkout;
    let getOrderDetailsApiStub;
    let dispatchStub;
    let OrderActions;
    let EditDataActions;
    let updateOrderActionStub;
    let checkoutUtils;
    let orderUtils;
    let FormsUtils;
    let UtilActions;
    let Events;
    let watchForErrorsStub;
    let changeCheckoutUrlStub;
    let disablePlaceOrderButtonStub;
    let perfReportStub;
    let refreshCheckoutStub;
    let fakePromise;
    let orderDetails;
    let setStateStub;
    let initialState;
    let checkoutBindings;
    let historyLocationActions;
    let goToStub;
    let event;
    let paymentCardNumberChangedStub;
    let subscribeStub;
    let props;

    beforeEach(() => {
        store = require('Store').default;
        Checkout = require('components/Checkout/CheckoutMain').default;
        checkoutApi = require('services/api/checkout').default;
        checkoutUtils = require('utils/Checkout').default;
        orderUtils = require('utils/Order').default;
        FormsUtils = require('utils/Forms').default;
        UtilActions = require('utils/redux/Actions').default;
        setAndWatch = store.setAndWatch;
        setAndWatchStub = spyOn(store, 'setAndWatch');
        subscribeStub = spyOn(store, 'subscribe');
        getOrderDetailsApiStub = spyOn(checkoutApi, 'getOrderDetails');
        dispatchStub = spyOn(store, 'dispatch');
        Events = require('utils/framework/Events').default;
        OrderActions = require('actions/OrderActions').default;
        EditDataActions = require('actions/EditDataActions').default;
        updateOrderActionStub = spyOn(OrderActions, 'updateOrder');
        paymentCardNumberChangedStub = spyOn(OrderActions, 'paymentCardNumberChanged');
        changeCheckoutUrlStub = spyOn(checkoutUtils, 'changeCheckoutUrlBasedOnOrderCompleteness');
        disablePlaceOrderButtonStub = spyOn(checkoutUtils, 'disablePlaceOrderButtonBasedOnCheckoutCompleteness');
        checkoutBindings = require('analytics/bindings/pages/checkout/checkoutBindings').default;
        historyLocationActions = require('actions/framework/HistoryLocationActions').default;
        goToStub = spyOn(historyLocationActions, 'goTo');
        Sephora.analytics = { initialLoadDependencies: [] };

        orderDetails = {
            isInitialized: false,
            header: {
                profile: { user: {} },
                isComplete: undefined
            },
            items: { items: [] },
            priceInfo: {},
            shippingGroups: { shippingGroupsEntries: [] },
            paymentGroups: { paymentGroupsEntries: [] }
        };

        fakePromise = {
            then: callback => {
                callback(orderDetails);
            }
        };

        getOrderDetailsApiStub.and.returnValue(fakePromise);

        initialState = {
            focus: {
                giftCardShipAddress: false,
                giftCardShipOptions: false,
                shipAddress: false,
                shipOptions: false,
                payment: false,
                account: false
            },
            orderDetails: {},
            paymentOptions: {}
        };
        event = {
            preventDefault: () => {},
            target: { value: 123456 }
        };
    });

    describe('the controller', () => {
        beforeEach(() => {
            watchForErrorsStub = spyOn(checkoutBindings, 'watchForErrors');

            wrapper = shallow(<Checkout {...props} />);
            component = wrapper.instance();
            component.state = {
                isShipOptionsFirstTimeForNewUser: true,
                isGiftShipOptionsFirstTimeForNewUser: true
            };
            component.componentDidMount();
        });

        describe('should set and watch', () => {
            beforeEach(() => {
                // Arrange
                store.setAndWatch = setAndWatch;
                setAndWatchStub = spyOn(store, 'setAndWatch');

                // Action
                wrapper = shallow(<Checkout {...props} />);
                component = wrapper.instance();
            });

            it('should set and watch for order details', () => {
                // Act
                component.componentDidMount();

                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
            });

            it('for klarna to be selected', () => {
                // Act
                component.componentDidMount();

                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('klarna.isSelected', component, any(Function));
            });

            it('for klarna to update Checkout with selected state', () => {
                // Arrange
                setAndWatchStub.and.callFake((...args) => {
                    if (args[0] === 'klarna.isSelected') {
                        args[2]({ isSelected: true });
                    }
                });

                // Act
                component.componentDidMount();

                // Assert
                expect(component.state.isKlarnaSelected).toBeTruthy();
            });

            it('for klarna to track the error', () => {
                // Act
                component.componentDidMount();

                // Assert
                expect(setAndWatchStub).toHaveBeenCalledWith('klarna.error', component, any(Function));
            });

            it('for klarna to update Checkout with selected state', () => {
                // Arrange
                setAndWatchStub.and.callFake((...args) => {
                    if (args[0] === 'klarna.error') {
                        args[2]({ error: { errorMessage: 'klarnaErrorMessage' } });
                    }
                });

                // Act
                component.componentDidMount();

                // Assert
                expect(component.state.klarnaError).toEqual('klarnaErrorMessage');
            });

            it('for klarna to fire tracking error event', () => {
                // Arrange
                const processEvent = require('analytics/processEvent').default;
                const anaConsts = require('analytics/constants').default;
                const anaUtils = require('analytics/utils').default;
                const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError').default;
                const processStub = spyOn(processEvent, 'process');
                spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({ previousPage: 'previousPageData' });
                setAndWatchStub.and.callFake((...args) => {
                    if (args[0] === 'klarna.error') {
                        args[2]({
                            error: {
                                errorMessage:
                                    'It is really long klarnaErrorMessage with more than 100 symbols ' +
                                    'to be sliced. Message is really long and this part should be removed',
                                fireAnalytics: true
                            }
                        });
                    }
                });

                // Act
                component.componentDidMount();

                // Assert
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        bindingMethods: linkTrackingError,
                        errorMessages: ['klarna:It is really long klarnaErrorMessage with more than 100 symbols ' + 'to be sliced. Message is real'],
                        eventStrings: [anaConsts.Event.EVENT_71],
                        fieldErrors: ['flexible-payments'],
                        linkName: 'error',
                        usePreviousPageName: true,
                        previousPage: 'previousPageData'
                    }
                });
            });

            it('for afterpay to fire tracking error event', () => {
                // Arrange
                const processEvent = require('analytics/processEvent').default;
                const anaConsts = require('analytics/constants').default;
                const anaUtils = require('analytics/utils').default;
                const linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError').default;
                const processStub = spyOn(processEvent, 'process');
                spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({ previousPage: 'previousPageData' });
                setAndWatchStub.and.callFake((...args) => {
                    if (args[0] === 'afterpay.error') {
                        args[2]({
                            error: {
                                errorMessage:
                                    'It is really long afterpayErrorMessage with more than 100 symbols ' +
                                    'to be sliced. Message is really long and this part should be removed',
                                fireAnalytics: true
                            }
                        });
                    }
                });

                // Act
                component.componentDidMount();

                // Assert
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        bindingMethods: linkTrackingError,
                        errorMessages: ['afterpay:It is really long afterpayErrorMessage with more than 100 symbols ' + 'to be sliced. Message is '],
                        eventStrings: [anaConsts.Event.EVENT_71],
                        fieldErrors: ['flexible-payments'],
                        linkName: 'error',
                        usePreviousPageName: true,
                        previousPage: 'previousPageData'
                    }
                });
            });
        });

        it('should set and watch for the router path', () => {
            expect(subscribeStub).toHaveBeenCalled();
        });

        it('should call changeCheckoutUrlBasedOnOrderCompleteness with correct args', () => {
            expect(changeCheckoutUrlStub).toHaveBeenCalledWith(true, true, true);
        });

        it('should dispatch orderReviewIsActive action', () => {
            expect(dispatchStub).toHaveBeenCalledWith(OrderActions.orderReviewIsActive(orderDetails.header.isComplete));
        });

        it('should call watchForErrors', () => {
            expect(watchForErrorsStub).toHaveBeenCalled();
        });
    });

    describe('set and watch callback for order details', () => {
        let parseAndSetCheckoutStateStub;
        let order;

        beforeEach(() => {
            order = { orderDetails: orderDetails };
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
        });

        it('should parse and set the state for component', () => {
            parseAndSetCheckoutStateStub = spyOn(component, 'parseAndSetCheckoutState');
            const setAndWatchOrderDetailsStubCalls = setAndWatchStub.calls.all().filter(el => el.args[0] === 'order.orderDetails');
            setAndWatchOrderDetailsStubCalls[0].args[2](order);
            expect(component.parseAndSetCheckoutState).toHaveBeenCalledWith(orderDetails);
        });

        it('should change the checkout url based on order completeness', () => {
            parseAndSetCheckoutStateStub = spyOn(component, 'parseAndSetCheckoutState');
            const setAndWatchOrderDetailsStubCalls = setAndWatchStub.calls.all().filter(el => el.args[0] === 'order.orderDetails');
            setAndWatchOrderDetailsStubCalls[0].args[2](order);
            expect(changeCheckoutUrlStub.calls.mostRecent().args[0]).toEqual(undefined);
        });
    });

    describe('set and watch callback for router path', () => {
        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
            component.setState({
                paymentOptions: {}
            });
            setStateStub = spyOn(component, 'setState');
        });

        it('should set state dependent on the router path', () => {
            const router = { path: '/checkout/payment' };
            spyOn(component, 'updateOrderDetails').and.returnValue({ then: createSpy().and.callFake(arg0 => arg0()) });

            component.updateStatePerHistoryPathChange(router);
            expect(setStateStub).toHaveBeenCalledWith({
                isShipOptionsFirstTimeForNewUser: undefined,
                isGiftShipOptionsFirstTimeForNewUser: undefined,
                focus: {
                    payment: true,
                    isInitialized: true
                }
            });
        });

        it('should update state with Klarna selection', () => {
            // Arrange
            const router = { path: '/checkout/payment' };
            spyOn(component, 'updateOrderDetails').and.returnValue({ then: createSpy().and.callFake(arg0 => arg0()) });
            spyOn(orderUtils, 'getPaymentGroup').and.returnValue(true);
            spyOn(component, 'isKlarnaEnabledForThisOrder').and.returnValue(true);
            const KlarnaActions = require('actions/KlarnaActions').default;
            const toggleSelectStub = spyOn(KlarnaActions, 'toggleSelect');

            // Act
            component.updateStatePerHistoryPathChange(router);

            // Assert
            expect(toggleSelectStub).toHaveBeenCalledWith(true);
        });

        it('should change the state for a new user for shipping options if the user hits the options section', () => {
            const router = { path: '/checkout/delivery' };
            spyOn(component, 'updateOrderDetails').and.returnValue({ then: createSpy().and.callFake(arg0 => arg0()) });
            component.updateStatePerHistoryPathChange(router);
            expect(setStateStub).toHaveBeenCalledWith({
                isShipOptionsFirstTimeForNewUser: undefined,
                isGiftShipOptionsFirstTimeForNewUser: undefined,
                focus: {
                    shipOptions: true,
                    isInitialized: true
                }
            });
        });
    });

    describe('updateOrderDetails', () => {
        let onLastLoadEventStub;

        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();

            onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
            Sephora.configurationSettings.isKlarnaPaymentEnabled = true;
        });

        it('should disable Klarna if it\'s forced to be hidden by T&T', () => {
            // Arrange
            onLastLoadEventStub.and.callFake((...args) => {
                args[2]();
            });
            setAndWatchStub.and.callFake((...args) => {
                args[2]({ testTarget: { offers: { toggleKlarna: { result: { isHidden: true } } } } });
            });

            // Act
            component.updateOrderDetails({ path: '/checkout/payment' });

            // Assert
            expect(component.state.isInstallmentPaymentTestingEnabled).toEqual(undefined);
        });

        it('should load Klarna library after enabling Klarna for Checkout', () => {
            // Arrange
            const klarnaUtils = require('utils/Klarna').default;
            const loadLibraryStub = spyOn(klarnaUtils, 'loadLibrary');
            onLastLoadEventStub.and.callFake((...args) => {
                args[2]();
            });
            setAndWatchStub.and.callFake((...args) => {
                args[2]({ testTarget: { offers: { toggleKlarna: { result: { isHidden: false } } } } });
            });
            spyOn(component, 'isKlarnaEnabledForThisOrder').and.returnValue(true);

            // Act
            component.updateOrderDetails({ path: '/checkout/payment' });

            // Assert
            expect(loadLibraryStub).toHaveBeenCalled();
        });

        describe('when shippingGroupType is FlashElectronicShippingGroup', () => {
            let getShippingMethodsStub;

            beforeEach(() => {
                const newProps = {
                    ...orderDetails,
                    shippingGroups: {
                        shippingGroupsEntries: [{ shippingGroupType: 'FlashElectronicShippingGroup' }, { shippingGroupType: 'GiftCardShippingGroup' }]
                    }
                };

                wrapper = shallow(<Checkout {...newProps} />);
                component = wrapper.instance();
                getShippingMethodsStub = spyOn(component, 'getShippingMethods');
                refreshCheckoutStub = spyOn(component, 'refreshCheckout');
            });

            it('should not call the GET available shipping methods API', () => {
                component.refreshCheckoutWithoutUrlChange();

                expect(refreshCheckoutStub).toHaveBeenCalledWith({ changeURL: false });
                expect(getShippingMethodsStub).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe('isKlarnaEnabledForThisOrder', () => {
        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
        });

        it('should check if Klarna enabled on Order level', () => {
            // Arrange
            const isKlarnaEnabledStub = spyOn(orderUtils, 'isKlarnaEnabledForThisOrder');

            // Act
            component.isKlarnaEnabledForThisOrder(orderDetails);

            // Assert
            expect(isKlarnaEnabledStub).toHaveBeenCalledWith(orderDetails);
        });

        it('should check if there\'s no error and user is in guest or existing flow', () => {
            // Arrange
            component.setState({
                klarnaError: null,
                isNewUserFlow: false
            });
            spyOn(orderUtils, 'isKlarnaEnabledForThisOrder').and.returnValue(true);
            spyOn(checkoutUtils, 'isGuestOrder').and.returnValue(true);

            // Act
            const isKlarnaEnabledForThisOrder = component.isKlarnaEnabledForThisOrder(orderDetails);

            // Assert
            expect(isKlarnaEnabledForThisOrder).toBeTruthy();
        });
    });

    describe('parseAndSetCheckoutState', () => {
        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
            perfReportStub = spyOn(Sephora.Util.Perf, 'report');
        });

        it('should call set state', () => {
            setStateStub = spyOn(component, 'setState');
            component.parseAndSetCheckoutState(orderDetails);
            expect(setStateStub).toHaveBeenCalled();
        });

        it('should call Sephora.Util.Perf.report with Page Rendered if ', () => {
            component.parseAndSetCheckoutState(orderDetails);
            expect(perfReportStub).toHaveBeenCalledWith('Page Rendered');
        });
    });

    describe('refreshCheckoutWithoutUrlChange', () => {
        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
            refreshCheckoutStub = spyOn(component, 'refreshCheckout');
            component.refreshCheckoutWithoutUrlChange();
        });

        it('should call refreshCheckout with changeURL set to false', () => {
            expect(refreshCheckoutStub).toHaveBeenCalledWith({ changeURL: false });
        });
    });

    describe('change route', () => {
        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.changeRoute('payment');
        });

        it('should dispatch historyLocationActions.goTo action', () => {
            expect(dispatchStub).toHaveBeenCalledWith(goToStub());
        });

        it('should call goTo with correct path', () => {
            expect(goToStub).toHaveBeenCalledWith({ path: '/checkout/payment' });
        });
    });

    describe('isAutoUpdateShippingGroup', () => {
        let getStateStub;
        let result;

        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
            getStateStub = spyOn(store, 'getState').and.returnValue({ order: { orderDetails: { header: { autoUpdateShippingGroup: true } } } });
            result = component.isAutoUpdateShippingGroup();
        });

        it('should call getState', () => {
            expect(getStateStub).toHaveBeenCalledTimes(1);
        });

        it('should return store basket isAutoUpdateShippingGroup value', () => {
            expect(result).toEqual(true);
        });
    });

    describe('isAutoUpdateCreditCard', () => {
        let getStateStub;
        let result;

        beforeEach(() => {
            wrapper = shallow(<Checkout />);
            component = wrapper.instance();
            getStateStub = spyOn(store, 'getState').and.returnValue({ order: { orderDetails: { header: { autoUpdateCreditCard: true } } } });
            result = component.isAutoUpdateCreditCard();
        });

        it('should call getState', () => {
            expect(getStateStub).toHaveBeenCalledTimes(1);
        });

        it('should return store basket isAutoUpdateCreditCard value', () => {
            expect(result).toEqual(true);
        });
    });
});
