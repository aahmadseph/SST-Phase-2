const React = require('react');
const { shallow } = enzyme;
const { objectContaining } = jasmine;

describe('GlobalModalsWrapper component', () => {
    let GlobalModalsWrapper;
    let shallowComponent;

    beforeEach(() => {
        GlobalModalsWrapper = require('components/GlobalModals/GlobalModalsWrapper/GlobalModalsWrapper').default;
        shallowComponent = shallow(<GlobalModalsWrapper renderModals />, { disableLifecycleMethods: true });
    });

    it('should not render AddressVerificationModal component', () => {
        shallowComponent.setProps({ showAddressVerificationModal: false });
        expect(shallowComponent.find('AddressVerificationModal').length).toBe(0);
    });

    it('should render AddressVerificationModal component', () => {
        shallowComponent.setProps({ showAddressVerificationModal: true });
        expect(shallowComponent.find('AddressVerificationModal').length).toBe(1);
    });

    it('should render BccModal component', () => {
        shallowComponent.setProps({
            showBccModal: true,
            bccModalTemplate: {}
        });
        expect(shallowComponent.find('ErrorBoundary(Connect(BccModal))').length).toBe(1);
    });

    it('should prioritize QuickLookModal over BccModal component', () => {
        shallowComponent.setProps({
            showQuickLookModal: true,
            showBccModal: true,
            bccModalTemplate: {}
        });
        expect(shallowComponent.find('QuickLookModal').length).toBe(1);
    });

    it('should prioritize AddToBasketModal over QuickLookModal component', () => {
        shallowComponent.setProps({
            showQuickLookModal: true,
            showAddToBasketModal: true
        });
        expect(shallowComponent.find('AddToBasketModal').length).toBe(1);
    });

    it('should pass analyticsContext property from own state to EmailMeWhenInStockModal component when showEmailMeWhenInStockModal === true', () => {
        // Arrange
        const props = {
            emailInStockProduct: { currentSku: { actionFlags: {} } },
            showEmailMeWhenInStockModal: true,
            renderModals: true,
            analyticsContext: 'analyticsContext'
        };
        const { analyticsContext } = props;

        // Act
        const wrapper = shallow(<GlobalModalsWrapper {...props} />, { disableLifecycleMethods: true });

        // Assert
        expect(wrapper.find('EmailMeWhenInStockModal').props()).toEqual(objectContaining({ analyticsContext }));
    });

    it('should pass analyticsContext property from own state to AddToBasketModal component when showAddToBasketModal === true', () => {
        // Arrange
        const props = {
            emailInStockProduct: { currentSku: { actionFlags: {} } },
            showAddToBasketModal: true,
            renderModals: true,
            analyticsContext: 'analyticsContext'
        };
        const { analyticsContext } = props;

        // Act
        const wrapper = shallow(<GlobalModalsWrapper {...props} />, { disableLifecycleMethods: true });

        // Assert
        const addToBasketModalWrapper = wrapper.find('AddToBasketModal');
        expect(addToBasketModalWrapper.props()).toEqual(objectContaining({ analyticsContext }));
    });

    describe('RegisterModal component', () => {
        it('should render RegisterModal component', () => {
            shallowComponent.setProps({ showRegisterModal: true });

            expect(shallowComponent.find('RegisterModal').length).toBe(1);
        });
    });

    describe('BiRegisterModal component', () => {
        it('should render BiRegisterModal component', () => {
            shallowComponent.setProps({ showBiRegisterModal: true });

            expect(shallowComponent.find('BiRegisterModal').length).toBe(1);
        });

        it('should pass extraParams property if available', () => {
            // Arrange
            const props = {
                showBiRegisterModal: true,
                renderModals: true,
                extraParams: {
                    referral: {
                        campaignCode: 'campaign',
                        referrerCode: 'referrer'
                    }
                }
            };
            const { extraParams } = props;

            // Act
            const wrapper = shallow(<GlobalModalsWrapper {...props} />, { disableLifecycleMethods: true });

            // Assert
            expect(wrapper.find('BiRegisterModal').props()).toEqual(objectContaining({ extraParams }));
        });
    });

    // describe('SignInModal component', () => {
    //     const commonProps = {
    //         signInData: {
    //             isPlaySubscriptionOrder: false,
    //             isEmailDisabled: false,
    //             isRadioDisabled: false,
    //             isSSIEnabled: false
    //         }
    //     };
    // });
});
