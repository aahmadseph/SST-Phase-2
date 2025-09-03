describe('<Address /> component', () => {
    let React;
    let Address;
    let shallowedComponent;

    beforeEach(() => {
        React = require('react');
        Address = require('components/Addresses/Address').default;
    });

    it('should render main Box', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                state: 'State',
                postalCode: '12345',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: false
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        expect(shallowedComponent.find('Box').at(0)).not.toBeNull();
    });

    it('should render user name', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                state: 'State',
                postalCode: '12345',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: false
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        expect(shallowedComponent.find('Text').prop('children')).toEqual(['First', ' ', 'Last']);
    });

    // it('should render user name with default tag if this is the default address', () => {
    //     const props = {
    //         address: {
    //             isDefault: true,
    //             firstName: 'First',
    //             lastName: 'Last',
    //             address1: 'Address 1',
    //             state: 'State',
    //             postalCode: '12345',
    //             country: 'US',
    //             phone: '(111) 111-1111'
    //         },
    //         isDisplayShippingOnCheckout: false,
    //         isEditShippingOnCheckout: true
    //     };
    //     shallowedComponent = enzyme.shallow(<Address {...props} />);
    //     expect(shallowedComponent.find('Box').at(1).prop('children')[1]).toBe(' (Default)');
    // });

    it('should render address 1', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                state: 'State',
                postalCode: '12345',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: false
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        const address1Div = shallowedComponent.find('div').at(0);
        expect(address1Div.prop('children')).toBe('Address 1');
    });

    it('should render address 2 if it is available', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                address2: 'Address 2',
                state: 'State',
                postalCode: '12345',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: false
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        const address2Div = shallowedComponent.find('div').at(1);
        expect(address2Div.prop('children')).toBe('Address 2');
    });

    it('should state and postal code', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                state: 'State',
                postalCode: '12345',
                city: '',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: false
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        const statePostalCodeDiv = shallowedComponent.find('[data-at="ship_addr_state"]');
        expect(statePostalCodeDiv.prop('children')).toEqual(['State', ' ', '12345']);
    });

    it('should city, state and postal code if city is present in address', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                state: 'State',
                postalCode: '12345',
                city: 'City',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: false
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        const statePostalCodeDiv = shallowedComponent.find('[data-at="ship_addr_state"]');
        expect(statePostalCodeDiv.prop('children')).toEqual(['City', ', ', 'State', ' ', '12345']);
    });

    it('should render country', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                state: 'State',
                postalCode: '12345',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: true
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        const countryDiv = shallowedComponent.find('div > div').at(0);
        expect(countryDiv.prop('children')).toBe('US');
    });

    it('should render phone number', () => {
        const props = {
            address: {
                isDefault: false,
                firstName: 'First',
                lastName: 'Last',
                address1: 'Address 1',
                state: 'State',
                postalCode: '12345',
                country: 'US',
                phone: '(111) 111-1111'
            },
            isDisplayShippingOnCheckout: false,
            isEditShippingOnCheckout: true
        };
        shallowedComponent = enzyme.shallow(<Address {...props} />);
        const countryDiv = shallowedComponent.find('div > div').at(1);
        expect(countryDiv.prop('children')).toBe('(111) 111-1111');
    });
});
