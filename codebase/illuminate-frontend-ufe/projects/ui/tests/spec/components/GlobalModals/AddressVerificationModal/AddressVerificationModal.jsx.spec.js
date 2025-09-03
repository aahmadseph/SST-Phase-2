describe('<AddressVerificationModal> component', () => {
    let React;
    let AddressVerificationModal;
    let shallowComponent;
    let props;
    let textComp;
    let buttonComp;
    let linkComp;

    beforeEach(() => {
        React = require('react');
        AddressVerificationModal = require('components/GlobalModals/AddressVerificationModal/AddressVerificationModal').default;

        props = {
            isOpen: true,
            verificationType: 'UNVERIFIED',
            currentAddress: {
                address1: 'my address 1',
                address2: 'my address 2',
                city: 'my city',
                state: 'my state',
                postalCode: '12345',
                country: 'US'
            },
            recommendedAddress: {
                address1: 'my recommended address 1',
                address2: 'my recommended address 2',
                city: 'my recommended city',
                state: 'my recommended state',
                postalCode: '12345',
                country: 'US'
            },
            successCallback: () => {},
            cancelCallback: () => {}
        };

        shallowComponent = enzyme.shallow(<AddressVerificationModal {...props} />, { disableLifecycleMethods: true });
        textComp = shallowComponent.find('Text');
        buttonComp = shallowComponent.find('Button');
        linkComp = shallowComponent.find('Link');
    });

    it('should render a modal instance', () => {
        expect(shallowComponent.find('Modal').length).toBe(1);
    });

    it('should render the correct modal title', () => {
        expect(shallowComponent.find('ModalTitle').children(0).text()).toBe('Please double-check your address');
    });

    it('should render the correct legend', () => {
        expect(textComp.at(0).prop('children')).toBe('Your shipping address could not be verified.');
    });

    it('should render button for success', () => {
        expect(buttonComp.length).toBe(1);
    });

    it('should render link for cancel', () => {
        expect(linkComp.length).toBe(1);
    });

    it('should render success button with right text', () => {
        expect(buttonComp.at(0).children(0).text()).toBe('Edit address');
    });

    it('should render cancel button as a primary', () => {
        expect(buttonComp.at(0).prop('variant')).toBe('primary');
    });

    it('should render cancel button with right text', () => {
        expect(linkComp.at(0).children(0).text()).toBe('Use the address I entered');
    });

    it('should not have data-at for Validate Address Verification', () => {
        expect(shallowComponent.prop('dataAt')).toBe('double_check_modal');
    });

    describe('for Recommended Address', () => {
        beforeEach(() => {
            props.verificationType = 'RECOMMENDED';
            shallowComponent = enzyme.shallow(<AddressVerificationModal {...props} />);
        });

        it('should have data-at for Recommended Address modal', () => {
            expect(shallowComponent.prop('dataAt')).toBe('recommend_address_modal');
        });

        it('should have data-at for Recommended Address address text', () => {
            const recommendedAddressText = shallowComponent.find('ModalBody > Box');
            expect(recommendedAddressText.prop('data-at')).toBe('recommend_address');
        });
    });
});
