/* eslint-disable object-curly-newline */
const React = require('react');
const { any, objectContaining } = jasmine;
const { shallow } = require('enzyme');
const Actions = require('Actions').default;
const OrderActions = require('actions/OrderActions').default;
const store = require('Store').default;
const checkoutApi = require('services/api/checkout').default;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const OrderCancelationModal = require('components/GlobalModals/OrderCancelationModal/OrderCancelationModal').default;

describe('OrderCancelationModal component', () => {
    let dispatchStub;
    let showInfoModal;
    let showInfoModalStub;
    let component;
    let props;
    let showOrderCancelationModalStub;
    let showCancelationResponseStub;
    let cancelOrderStub;

    beforeEach(() => {
        dispatchStub = spyOn(store, 'dispatch');
        showOrderCancelationModalStub = spyOn(Actions, 'showOrderCancelationModal');
        props = {
            orderId: 'someOrderId',
            selfCancelationReasons: {
                otherReasonCode: '40',
                reasonCodes: [
                    {
                        reasonCode: '31',
                        description: 'I want to modify the items in my order'
                    },
                    {
                        reasonCode: '32',
                        description: 'I forgot to add a promo code'
                    },
                    {
                        reasonCode: '33',
                        description: 'I want to change the shipping address'
                    },
                    {
                        reasonCode: '34',
                        description: 'I want to change the payment method'
                    },
                    {
                        reasonCode: '40',
                        description: 'Other'
                    }
                ]
            }
        };
    });

    describe('ctrlr method', () => {
        let processStub;

        beforeEach(() => {
            processStub = spyOn(processEvent, 'process');
            const wrapper = shallow(<OrderCancelationModal {...props} />);
            component = wrapper.instance();
        });

        it('should call processEvent method with correct args', () => {
            const actionInfo = `${anaConsts.ACTION_INFO.ORDER_CANCELLATION}:request`;
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo,
                    linkName: actionInfo,
                    eventStrings: [anaConsts.Event.ORDER_CANCELLATION_REQUEST]
                }
            });
        });
    });

    describe('requestClose method', () => {
        beforeEach(() => {
            const wrapper = shallow(<OrderCancelationModal />);
            component = wrapper.instance();
            component.requestClose();
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with params', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showOrderCancelationModalStub());
        });

        it('should call showOrderCancelationModal method', () => {
            expect(showOrderCancelationModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showOrderCancelationModal method with params', () => {
            expect(showOrderCancelationModalStub).toHaveBeenCalledWith(false, null);
        });
    });

    describe('cancelOrder method', () => {
        let fakePromise;
        let response;

        beforeEach(() => {
            response = {
                message: 'Your order has been successfully canceled...'
            };
            fakePromise = {
                then: resolve => {
                    resolve(response);

                    return fakePromise;
                },
                catch: () => {}
            };
            cancelOrderStub = spyOn(checkoutApi, 'cancelOrder').and.returnValue(fakePromise);
            const wrapper = shallow(<OrderCancelationModal {...props} />);
            component = wrapper.instance();
            showCancelationResponseStub = spyOn(component, 'showCancelationResponse');
        });

        it('should not call cancelOrder method of checkoutApi if reasonCode is not set', () => {
            component.cancelOrder();
            expect(cancelOrderStub).not.toHaveBeenCalled();
        });

        it('should call cancelOrder method of checkoutApi', () => {
            component.setState({
                reasonCode: 'testReasonCode'
            });
            component.cancelOrder();
            expect(cancelOrderStub).toHaveBeenCalledTimes(1);
        });

        it('should not call cancelOrder method of checkoutApi if reasonCode is other and reasonText is not set', () => {
            component.setState({
                reasonCode: '40',
                reasonText: ''
            });
            component.cancelOrder();
            expect(cancelOrderStub).not.toHaveBeenCalled();
        });

        it('should call showCancellationResponse method', () => {
            component.setState({
                reasonCode: 'testReasonCode'
            });
            component.cancelOrder();
            expect(showCancelationResponseStub).toHaveBeenCalledTimes(1);
        });

        it('should call showCancellationResponse method with correct data', () => {
            component.setState({
                reasonCode: 'testReasonCode'
            });
            component.cancelOrder();
            expect(showCancelationResponseStub).toHaveBeenCalledWith(response);
        });
    });

    describe('showCancellationConfirmation', () => {
        let orderData;
        let getOrderDetailsStub;
        let updateOrderStub;
        let trackCancellationResponseStub;
        let response;

        beforeEach(() => {
            orderData = {
                header: {}
            };
            getOrderDetailsStub = spyOn(checkoutApi, 'getOrderDetails').and.returnValue({
                then: function (callback) {
                    callback(orderData);
                }
            });
            updateOrderStub = spyOn(OrderActions, 'updateOrder').and.returnValue('updatedOrder');
            showInfoModal = Actions.showInfoModal;
            showInfoModalStub = spyOn(Actions, 'showInfoModal').and.callFake(({ callback }) => callback());
            response = {
                responseCode: 1,
                message: 'Your order has been successfully canceled...'
            };
            const wrapper = shallow(<OrderCancelationModal {...props} />);
            component = wrapper.instance();
            trackCancellationResponseStub = spyOn(component, 'trackCancellationResponse');
        });

        it('should call dispatch method', () => {
            component.showCancelationResponse(response);
            expect(dispatchStub).toHaveBeenCalledTimes(3);
        });

        it('should call showOrderCancelationModal method', () => {
            component.showCancelationResponse(response);
            expect(showOrderCancelationModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showOrderCancelationModal method with params', () => {
            component.showCancelationResponse(response);
            expect(showOrderCancelationModalStub).toHaveBeenCalledWith(false, null);
        });

        it('should call showInfoModal method', () => {
            component.showCancelationResponse(response);
            expect(showInfoModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showInfoModal method with correct data', () => {
            // Arrange
            Actions.showInfoModal = showInfoModal;
            showInfoModalStub = spyOn(Actions, 'showInfoModal', ({ callback }) => callback());

            // Act
            const wrapper = shallow(<OrderCancelationModal {...props} />);
            component = wrapper.instance();
            component.showCancelationResponse(response);

            // Assert
            expect(showInfoModalStub).toHaveBeenCalledWith({
                isOpen: true,
                title: 'Order Cancelation',
                message: response.message,
                buttonText: 'OK',
                dataAt: 'self_cancel_confirm_popup',
                dataAtTitle: 'self_cancel_confirm_popup_title',
                dataAtMessage: 'self_cancel_confirm_popup_message',
                callback: any(Function)
            });
        });

        it('should call showInfoModal method with the correct message if api responds with responseCode => 2', () => {
            response.responseCode = 2;
            component.showCancelationResponse(response);
            expect(showInfoModalStub).toHaveBeenCalledWith(
                objectContaining({
                    message: component.getText('messageFailure', true, '/beauty/contact-us|style=primary')
                })
            );
        });

        it('should refetch updated order on Modal close', () => {
            component.showCancelationResponse(response);
            expect(getOrderDetailsStub).toHaveBeenCalledWith('someOrderId');
        });

        it('should update store with Order data', () => {
            component.showCancelationResponse(response);
            expect(updateOrderStub).toHaveBeenCalledWith(orderData);
        });

        it('should dispatch an action to trigger the store update', () => {
            component.showCancelationResponse(response);
            expect(dispatchStub).toHaveBeenCalledWith('updatedOrder');
        });

        it('should call trackCancellationResponse with response code', () => {
            component.showCancelationResponse(response);
            expect(trackCancellationResponseStub).toHaveBeenCalledWith(1);
        });
    });

    describe('trackCancellationResponse', () => {
        let processStub;
        let actionInfo;
        let eventStrings;

        beforeEach(() => {
            processStub = spyOn(processEvent, 'process');
            const wrapper = shallow(<OrderCancelationModal {...props} />);
            component = wrapper.instance();
        });

        it('should call processEvent method with the correct values if the cancellation is successful', () => {
            actionInfo = `${anaConsts.ACTION_INFO.ORDER_CANCELLATION}:success`;
            eventStrings = [anaConsts.Event.ORDER_CANCELLATION_SUCCESS];
            component.trackCancellationResponse(1);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo,
                    linkName: actionInfo,
                    eventStrings
                }
            });
        });

        it('should call processEvent method with the correct values if the cancellation is declined', () => {
            actionInfo = `${anaConsts.ACTION_INFO.ORDER_CANCELLATION}:decline`;
            eventStrings = [anaConsts.Event.ORDER_CANCELLATION_DECLINE];
            component.trackCancellationResponse(2);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo,
                    linkName: actionInfo,
                    eventStrings
                }
            });
        });

        it('should not call processEvent method for API errors', () => {
            component.trackCancellationResponse(3);
            expect(processStub).toHaveBeenCalledTimes(1);
        });

        it('should not call processEvent method for malformed API response', () => {
            component.trackCancellationResponse();
            expect(processStub).toHaveBeenCalledTimes(1);
        });
    });
});
