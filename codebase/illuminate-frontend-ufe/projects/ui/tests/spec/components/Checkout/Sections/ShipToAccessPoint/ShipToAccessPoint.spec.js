const React = require('react');
const { shallow } = require('enzyme');
const { objectContaining } = jasmine;
const decorators = require('utils/decorators').default;
const checkoutApi = require('services/api/checkout').default;
const ShipToAccessPoint = require('components/Checkout/Sections/ShipToAccessPoint/ShipToAccessPoint').default;

const getFakePromise = (done, resolveWith = {}) => ({
    then: function (resolve) {
        resolve(resolveWith);
        done();

        return getFakePromise(done);
    },
    catch: function () {
        return function () {};
    }
});

const defaultProps = {
    editMode: false,
    isComplete: true,
    order: {
        halOperatingHours: []
    },
    updateCurrentHalAddress: () => {},
    getStateList: () => {}
};

const defaultPickupPerson = {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: 1234567890,
    email: 'test@sephora.com'
};

describe('ShipToAccessPoint component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ShipToAccessPoint {...defaultProps} />);
    });

    it('should be rendered', () => {
        const compKey = wrapper.at(0).key();
        expect(compKey).toEqual('shipToAccessPoint_unfocus');
    });

    describe('Guest Checkout', () => {
        let guestCheckoutProps;
        let createShippingAddressStub;
        let withIntersticeStub;

        beforeEach(() => {
            guestCheckoutProps = {
                ...defaultProps,
                editMode: true,
                isGuestCheckout: true,
                sectionSaved: () => {}
            };
            createShippingAddressStub = spyOn(checkoutApi, 'createShippingAddress');
            withIntersticeStub = spyOn(decorators, 'withInterstice');
            wrapper = shallow(<ShipToAccessPoint {...guestCheckoutProps} />);
        });

        it('form should include Text Input to capture E-mail address', () => {
            const emailInput = wrapper.find('InputEmail[name="email"]');
            expect(emailInput.length).toEqual(1);
        });

        it('form should include Text Input to capture E-mail address', done => {
            createShippingAddressStub.and.returnValue(getFakePromise(done));
            withIntersticeStub.and.returnValue(createShippingAddressStub);
            wrapper.setState({ pickupPerson: { ...defaultPickupPerson } });

            const okButton = wrapper.find('AccordionButton');
            okButton.simulate('click');

            expect(createShippingAddressStub).toHaveBeenCalledWith(
                objectContaining({
                    address: objectContaining({ shipEmail: defaultPickupPerson.email })
                })
            );
        });
    });

    describe('AccessPointButton component', () => {
        const props = {
            ...defaultProps,
            editMode: true,
            isHalAvailable: true
        };

        it('should not be rendered when ShipAddressDisplay prop editMode is false', () => {
            const wrapperWithProps = shallow(
                <ShipToAccessPoint
                    {...props}
                    editMode={false}
                />
            );
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            expect(accessPointBtn.length).toBe(0);
        });

        it('should be of variant "linkOnly"', () => {
            const wrapperWithProps = shallow(<ShipToAccessPoint {...props} />);
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            const linkOnlyVariant = accessPointBtn.props().variant;
            expect(linkOnlyVariant).toEqual('linkOnly');
        });
    });
});
