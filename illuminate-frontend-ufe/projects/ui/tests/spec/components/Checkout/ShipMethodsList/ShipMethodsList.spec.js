const React = require('react');
const { shallow } = require('enzyme');
const ShipMethodsList = require('components/Checkout/Sections/ShipOptions/ShipMethodsList/ShipMethodsList').default;

describe('ShipMethodsList component', () => {
    let props;
    let component;
    let wrapper;

    const mockedShippingData = [
        {
            shippingFee: '$0.00',
            shippingMethodDescription: '(Estimated Delivery: Fri 10/27)',
            shippingMethodId: '300004',
            shippingMethodType: 'Standard 3 Day'
        },
        {
            shippingFee: '$10.95',
            shippingMethodDescription: '(Estimated Delivery: Thu 10/26)',
            shippingMethodId: '300008',
            shippingMethodType: '2 Day Shipping'
        },
        {
            shippingFee: '$6.95',
            shippingMethodDescription: '(Estimated Delivery: Thu 10/26 to Mon 10/30)',
            shippingMethodId: '300012',
            shippingMethodType: 'USPS Priority'
        }
    ];

    beforeEach(() => {});

    describe('Ctrlr', () => {
        let setStateStub;

        it('should setState to display expanded version of shipping options', () => {
            props = {
                isGuestCheckout: true,
                shippingGroup: { shippingMethod: { shippingFee: '$10.95' } },
                shippingMethods: mockedShippingData
            };
            wrapper = shallow(<ShipMethodsList {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.componentDidMount();

            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                showOtherOptions: true,
                isViewLinkVisible: false
            });
        });

        it('should not call setState since first shippingMethod is selected', () => {
            props = {
                isGuestCheckout: true,
                shippingGroup: { shippingMethod: { shippingFee: '$0.00' } },
                shippingMethods: mockedShippingData
            };
            wrapper = shallow(<ShipMethodsList {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.componentDidMount();

            expect(setStateStub).not.toHaveBeenCalled();
        });
    });

    it('should render with data-at attrubute set to "ship_methods_list"', () => {
        // Arrange
        props = {
            shippingGroup: { shippingMethod: { shippingFee: '$10.95' } },
            shippingMethods: [{}]
        };

        // Act
        wrapper = shallow(<ShipMethodsList {...props} />);

        // Assert
        const buttonElement = wrapper.find('div[data-at="ship_methods_list"]');
        expect(buttonElement.exists()).toBe(true);
    });

    it('should render with data-at attrubute set to "more_delivery_options_btn"', () => {
        // Arrange
        props = {
            shippingGroup: { shippingMethod: { shippingFee: '$10.95' } },
            shippingMethods: [{}, {}],
            isGuestCheckout: true
        };

        // Act
        wrapper = shallow(<ShipMethodsList {...props} />);

        // Assert
        const buttonElement = wrapper.find('[data-at="more_delivery_options_btn"]');
        expect(buttonElement.exists()).toBe(true);
    });
});
