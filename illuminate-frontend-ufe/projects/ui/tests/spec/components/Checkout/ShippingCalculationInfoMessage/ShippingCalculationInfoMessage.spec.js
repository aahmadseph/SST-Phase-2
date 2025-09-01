const React = require('react');
const { shallow } = enzyme;

describe('ShippingCalculationInfoMessage', function () {
    let ShippingCalculationInfoMessage;
    let component;
    let wrapper;
    let setStateStub;
    let Storage;
    const userHasSeenUpdatedShippingKey = require('utils/localStorage/Constants').default.USER_HAS_SEEN_UPDATED_SHIPPING_CALCULATIONS;

    beforeEach(function () {
        ShippingCalculationInfoMessage = require('components/Checkout/Shared/ShippingCalculationInfoMessage/ShippingCalculationInfoMessage').default;
        Storage = require('utils/localStorage/Storage').default;
    });

    describe('Hide Form', function () {
        let setLocalstorageStub;

        beforeEach(function () {
            wrapper = shallow(<ShippingCalculationInfoMessage />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            setLocalstorageStub = spyOn(Storage.local, 'setItem');
            component.handleHideClick();
        });

        it('should hide the message', function () {
            expect(setStateStub).toHaveBeenCalledWith({ showUpdatedShippingCalculations: false });
        });

        it('should update LocalStorage value', function () {
            expect(setLocalstorageStub).toHaveBeenCalledWith(userHasSeenUpdatedShippingKey, true);
            expect(setLocalstorageStub).toHaveBeenCalled();
        });
    });
});
