const React = require('react');
const { shallow } = require('enzyme');
const { TOGGLE_CVC_INFO_MODAL } = require('constants/actionTypes/order');

describe('CVC Info Modal', function () {
    const CVCInfoModal = require('components/Checkout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal').default;
    const store = require('Store').default;
    const OrderActions = require('actions/OrderActions').default;

    let setStateStub;
    let watchActionStub;
    let component;
    let wrapper;

    beforeEach(function () {
        spyOn(store, 'dispatch');
    });

    describe('Init Controller', function () {
        beforeEach(function () {
            watchActionStub = spyOn(store, 'watchAction');
            wrapper = shallow(<CVCInfoModal />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should watch for action that opens or closes CVC Info modal', function () {
            expect(watchActionStub).toHaveBeenCalledTimes(1);
        });

        it('should watch for correct action', function () {
            expect(watchActionStub.calls.first().args[0]).toEqual(TOGGLE_CVC_INFO_MODAL);
        });

        it('should set state of the component according to data of watcher', function () {
            const actionCallback = watchActionStub.calls.first().args[1];
            const data = { isOpen: true };
            actionCallback(data);
            expect(setStateStub).toHaveBeenCalledWith({ isOpen: data.isOpen });
        });
    });

    describe('Close CVC Modal', function () {
        let showCVCInfoModalStub;

        beforeEach(function () {
            showCVCInfoModalStub = spyOn(OrderActions, 'showCVCInfoModal');
            wrapper = shallow(<CVCInfoModal />);
            component = wrapper.instance();
            component.close();
        });

        it('should dispatch an action on modal close', function () {
            expect(showCVCInfoModalStub.calls.first().args[0]).toEqual(false);
        });
    });
});
