/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow, mount } = require('enzyme');
const KlarnaPaymentMethod = require('components/Klarna/KlarnaPaymentMethod/KlarnaPaymentMethod').default;
const store = require('Store').default;
const KlarnaActions = require('actions/KlarnaActions').default;
const decorators = require('utils/decorators').default;
const checkoutApi = require('services/api/checkout').default;
const klarnaUtils = require('utils/Klarna').default;
const OrderUtils = require('utils/Order').default;
const OrderActions = require('actions/OrderActions').default;
const UtilActions = require('utils/redux/Actions').default;

describe('KlarnaPaymentMethod', () => {
    let wrapper;
    let component;
    let setAndWatchSpy;
    const sessionData = { clientToken: 'TOKEN' };

    beforeEach(() => {
        setAndWatchSpy = spyOn(store, 'setAndWatch');
    });

    describe('rendering', () => {
        beforeEach(() => {
            wrapper = shallow(<KlarnaPaymentMethod />);
            component = wrapper.instance();
        });

        it('should render iframe placeholder', () => {
            expect(wrapper.find('[id="klarna_iframe_wrapper"]').length).toEqual(1);
        });

        it('should render billing address checkbox', () => {
            expect(wrapper.find('Checkbox').length).toEqual(1);
        });

        it('should render legal notice', () => {
            expect(wrapper.findWhere(n => n.key() === 'klarnaLegalNotice').length).toEqual(1);
        });

        it('should be listening for order.orderDetails.priceInfo.creditCardAmount', () => {
            expect(setAndWatchSpy).toHaveBeenCalledWith('order.orderDetails.priceInfo.creditCardAmount', component, null, true);
        });

        it('should be listening for order.orderDetails.priceInfo.paypalAmount', () => {
            expect(setAndWatchSpy).toHaveBeenCalledWith('order.orderDetails.priceInfo.paypalAmount', component, null, true);
        });
    });

    describe('toggleCheckbox', () => {
        let dispatchSpy;
        let toggleShippingSpy;
        let checkbox;

        beforeEach(() => {
            dispatchSpy = spyOn(store, 'dispatch');
            toggleShippingSpy = spyOn(KlarnaActions, 'toggleShipping').and.returnValue('toggleShippingAction');
            wrapper = shallow(<KlarnaPaymentMethod />);
            component = wrapper.instance();
            checkbox = wrapper.find('Checkbox').first();
        });

        it('should be unchecked by default', () => {
            expect(checkbox.prop('checked')).toEqual(false);
        });

        it('should be listening for klarna.useMyShippingAddress', () => {
            expect(setAndWatchSpy).toHaveBeenCalledWith('klarna.useMyShippingAddress', component, null, true);
        });

        it('should call toggleShipping when clicked', () => {
            checkbox.simulate('click');
            expect(toggleShippingSpy).toHaveBeenCalledWith(true);
        });

        it('should dispatch toggleShipping action when clicked', () => {
            checkbox.simulate('click');
            expect(dispatchSpy).toHaveBeenCalledWith('toggleShippingAction');
        });

        it('should not render checkbox for BOPIS orders', () => {
            component.setState({ isBopisOrder: true });
            expect(wrapper.find('Checkbox').exists()).toBeFalsy();
        });
    });

    describe('componentDidUpdate', () => {
        let loadIframeSpy;

        beforeEach(() => {
            wrapper = shallow(<KlarnaPaymentMethod />);
            component = wrapper.instance();
            loadIframeSpy = spyOn(component, 'loadIframe');
        });

        it('should not call loadIframeSpy if creditCardAmount has not been changed', () => {
            component.setState({
                newDummyStateToTriggetUpdate: 777,
                creditCardAmount: wrapper.state().creditCardAmount
            });
            expect(loadIframeSpy).not.toHaveBeenCalledWith();
        });

        it('should call loadIframeSpy if creditCardAmount has been changed', () => {
            component.setState({ creditCardAmount: 888 });
            expect(loadIframeSpy).toHaveBeenCalledTimes(1);
        });

        it('should call loadIframeSpy if paypalAmount exists', () => {
            component.setState({ paypalAmount: 999 });
            expect(loadIframeSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('componentWillUnmount', () => {
        let clearTimeoutSpy;
        beforeEach(() => {
            clearTimeoutSpy = spyOn(global, 'clearTimeout');
            wrapper = shallow(<KlarnaPaymentMethod />);
            component = wrapper.instance();
            component.timeout = 'timeoutId';
            wrapper.unmount();
        });

        it('should set isUnmounted flag', () => {
            expect(component.isUnmounted).toEqual(true);
        });

        it('should clear Klarna call timeout', () => {
            expect(clearTimeoutSpy).toHaveBeenCalledWith('timeoutId');
        });
    });

    describe('initKlarna', () => {
        let dispatchSpy;
        let initializeKlarnaCheckoutSpy;
        let getOrderDetailsSpy;
        let getOrderIdSpy;
        let updateOrderSpy;

        beforeEach(() => {
            dispatchSpy = spyOn(store, 'dispatch');
            initializeKlarnaCheckoutSpy = spyOn(checkoutApi, 'initializeKlarnaCheckout');
            getOrderDetailsSpy = spyOn(checkoutApi, 'getOrderDetails');
            initializeKlarnaCheckoutSpy.and.returnValue(Promise.resolve(sessionData));
            getOrderDetailsSpy.and.returnValue(Promise.resolve('OrderData'));
            getOrderIdSpy = spyOn(OrderUtils, 'getOrderId').and.returnValue('current');
            updateOrderSpy = spyOn(OrderActions, 'updateOrder').and.returnValue('ORDER_ACTION');

            wrapper = shallow(<KlarnaPaymentMethod />);
            component = wrapper.instance();
        });

        it('should call initializeKlarnaCheckout', () => {
            component.initKlarna();
            expect(initializeKlarnaCheckoutSpy).toHaveBeenCalledWith({ status: klarnaUtils.SESSION_STATUSES.UPDATE });
        });

        xit('should call getOrderDetails with OrderId', () => {
            component.initKlarna().then(() => {
                expect(getOrderDetailsSpy).toHaveBeenCalledWith('current');
            });
        });

        xit('should dispatch updateOrder action', () => {
            component.initKlarna().then(() => {
                expect(dispatchSpy).toHaveBeenCalledWith('ORDER_ACTION');
            });
        });

        xit('should return order and session data', () => {
            component.initKlarna().then(response => {
                expect(response).toEqual({
                    session: sessionData,
                    order: 'OrderData'
                });
            });
        });

        it('should call reject on initializeKlarnaCheckout error', () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            initializeKlarnaCheckoutSpy.and.returnValue(Promise.reject('errorCode'));
            component.initKlarna().catch(e => {
                expect(e).toEqual('errorCode');
            });
        });
    });

    xdescribe('loadIframe', () => {
        let dispatchSpy;
        let mergeSpy;
        let klarnaLoadSpy;
        let processEvent;

        beforeEach(() => {
            dispatchSpy = spyOn(store, 'dispatch');
            mergeSpy = spyOn(UtilActions, 'merge').and.returnValue('MERGE_ACTION');
            processEvent = require('analytics/processEvent').default;
            klarnaLoadSpy = spyOn(klarnaUtils, 'load').and.returnValue(Promise.resolve());
            wrapper = shallow(<KlarnaPaymentMethod />);
            component = wrapper.instance();

            spyOn(component, 'initKlarna').and.returnValue(
                Promise.resolve({
                    session: sessionData,
                    order: 'OrderData'
                })
            );
            spyOn(decorators, 'withInterstice').and.callFake(arg0 => arg0);
        });

        it('should set klarna.isReady to false before the call', () => {
            component.loadIframe();
            expect(mergeSpy).toHaveBeenCalledWith('klarna', 'isReady', false);
        });

        it('should call klarnaUtils.load', () => {
            component.loadIframe().then(() => {
                expect(klarnaLoadSpy).toHaveBeenCalledWith('klarna_iframe_wrapper', 'TOKEN');
            });
        });

        it('should not call klarnaUtils.load if isUnmounted', () => {
            component.isUnmounted = true;
            component.loadIframe().then(() => {
                expect(klarnaLoadSpy).not.toHaveBeenCalledWith();
            });
        });

        it('should call clearTimeout before call if timeout present', () => {
            component.timeout = 1;
            const clearTimeoutSpy = spyOn(global, 'clearTimeout');
            component.loadIframe().then(() => {
                expect(clearTimeoutSpy).toHaveBeenCalledWith(1);
            });
        });

        it('should setup new timeout with failure function ', () => {
            const setTimeoutSpy = spyOn(global, 'setTimeout').and.returnValue(2);
            component.loadIframe().then(() => {
                expect(setTimeoutSpy).toHaveBeenCalled();
                expect(component.timeout).toEqual(2);
            });
        });

        it('should set klarna.isReady to false after a successfull klarna.load call', () => {
            component.loadIframe().then(() => {
                klarnaLoadSpy().then(() => {
                    expect(mergeSpy).toHaveBeenCalledWith('klarna', 'isReady', false);
                });
            });
        });

        it('should call clearTimeout after a successfull klarna.load call', () => {
            const setTimeoutSpy = spyOn(global, 'setTimeout').and.returnValue(3);
            const clearTimeoutSpy = spyOn(global, 'clearTimeout');
            component.loadIframe().then(() => {
                klarnaLoadSpy().then(() => {
                    expect(clearTimeoutSpy).toHaveBeenCalledWith(3);
                });
            });
        });

        it('should clearTimeout after failed. klarna.load call', () => {
            const setTimeoutSpy = spyOn(global, 'setTimeout').and.returnValue(4);
            const clearTimeoutSpy = spyOn(global, 'clearTimeout');
            // eslint-disable-next-line prefer-promise-reject-errors
            klarnaLoadSpy.and.returnValue(Promise.reject());
            component.loadIframe().then(() => {
                klarnaLoadSpy().then(() => {
                    expect(clearTimeoutSpy).toHaveBeenCalledWith(4);
                });
            });
        });

        it('should dispatch klarna error after a failed klarna.load call', () => {
            const showErrorSpy = spyOn(KlarnaActions, 'showError').and.returnValue('klarna error goes here!!!');
            // eslint-disable-next-line prefer-promise-reject-errors
            klarnaLoadSpy.and.returnValue(Promise.reject());
            component.loadIframe().then(() => {
                klarnaLoadSpy().then(() => {
                    expect(dispatchSpy).toHaveBeenCalledWith('klarna error goes here!!!');
                });
            });
        });

        it('should call process analytics when there is a klarna error', () => {
            const processSpy = spyOn(processEvent, 'process');
            const showErrorSpy = spyOn(KlarnaActions, 'showError').and.returnValue('klarna error goes here!!!');
            // eslint-disable-next-line prefer-promise-reject-errors
            klarnaLoadSpy.and.returnValue(Promise.reject());
            component.loadIframe().then(() => {
                klarnaLoadSpy().then(() => {
                    expect(processSpy).toHaveBeenCalled();
                });
            });
        });
    });
});
