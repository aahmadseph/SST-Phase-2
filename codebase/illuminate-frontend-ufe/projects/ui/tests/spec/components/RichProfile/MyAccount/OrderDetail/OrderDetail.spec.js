const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');

describe('OrderDetail component', () => {
    let UrlUtils;
    let OrderUtils;
    let OrderActions;
    let checkoutApi;
    let store;
    let OrderDetail;
    let props;
    let component;
    let orderData;
    let Actions;
    let wrapper;
    beforeEach(() => {
        const processEvent = require('analytics/processEvent').default;
        spyOn(processEvent, 'process');
        orderData = { header: {} };
        OrderUtils = require('utils/Order').default;
        OrderActions = require('actions/OrderActions').default;
        UrlUtils = require('utils/Url').default;
        store = require('Store').default;
        checkoutApi = require('services/api/checkout').default;
        Actions = require('Actions').default;
        OrderDetail = require('components/RichProfile/MyAccount/OrderDetail/OrderDetail').default;
        spyOn(OrderUtils, 'getOrderHistoryUrl').and.returnValue('someURl');
        spyOn(checkoutApi, 'getOrderDetails').and.returnValue({
            then: function (callback) {
                callback(orderData);

                return { catch: () => {} };
            }
        });
        props = { orderId: 'someorderid' };
        wrapper = shallow(<OrderDetail {...props} />);
        component = wrapper.instance();
    });

    describe('Controller Initialization', () => {
        let updateOrderStub;
        let dispatchSpy;
        let setAndWatchSpy;

        beforeEach(() => {
            updateOrderStub = spyOn(OrderActions, 'updateOrder').and.returnValue('updatedOrder');
            dispatchSpy = spyOn(store, 'dispatch');
            setAndWatchSpy = spyOn(store, 'setAndWatch');
            spyOn(UrlUtils, 'getUrlLastFragment').and.returnValue('someorderid');
            spyOn(UrlUtils, 'getParams').and.returnValue({ guestEmail: 'guestEmail' });
            component.componentDidMount();
        });

        it('should update store with Order data', () => {
            expect(updateOrderStub).toHaveBeenCalledWith(orderData);
        });

        it('should dispatch an action to trigger the store update', () => {
            expect(dispatchSpy).toHaveBeenCalledWith('updatedOrder');
        });

        it('should follow the order changes and update the page data if needed', () => {
            expect(setAndWatchSpy).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
        });
    });

    describe('handleViewOrderHistoryClick', () => {
        beforeEach(() => {
            spyOn(UrlUtils, 'redirectTo');
            component.handleViewOrderHistoryClick();
        });

        it('should dispatch redirect call', () => {
            expect(UrlUtils.redirectTo).toHaveBeenCalledTimes(1);
        });

        it('should dispatch redirect call with someURl', () => {
            expect(UrlUtils.redirectTo).toHaveBeenCalledWith('someURl');
        });
    });

    describe('showOrderCancelationModal', () => {
        const header = { selfCancellationReasonCodes: 'cancelation_reasons' };
        const mockState = { order: { orderDetails: { header } } };
        let showOrderCancelModalActionSpy;

        beforeEach(async () => {
            spyOn(store, 'getState').and.returnValue(mockState);
            showOrderCancelModalActionSpy = spyOn(Actions, 'showOrderCancelationModal');
            shallow(
                component.renderSelfCancelationLink({
                    isSelfCancellationLinkEnabled: true,
                    isStandardOnly: true,
                    orderId: 'stubbedOrderId',
                    getText: () => ''
                })
            )
                .find('#cancelOrderLink')
                .simulate('click');
            await wrapper.update();
        });

        it('should call an action to show the modal', () => {
            expect(showOrderCancelModalActionSpy).toHaveBeenCalledWith(true, 'stubbedOrderId', 'cancelation_reasons');
        });
    });
});
