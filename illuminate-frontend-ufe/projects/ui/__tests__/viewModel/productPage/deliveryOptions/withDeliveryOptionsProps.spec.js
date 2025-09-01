import { fields } from 'viewModel/productPage/deliveryOptions/withDeliveryOptionsProps';
import mockState from '__mocks__/pageData/productPage/cream-lip-stain-liquid-lipstick-P281411_DeliveryOptions.json';

describe('ViewModel for DeliveryOptions component', () => {
    let state;

    beforeEach(async () => {
        // Create a deep copy - don't use JSON.parse(JSON.stringify( as it's 2 times slower
        state = window.structuredClone(mockState);
    });

    test('should provide all required fields', () => {
        // Arrange
        const ownProps = {
            currentProduct: state.page.product,
            serviceUnavailable: false
        };
        const requiredFields = {
            basket: expect.any(Object),
            deliveryOptions: expect.any(Array),
            forFreeShippingText: 'for FREE shipping',
            hasPickupMessage: false,
            isSDUAddedToBasket: undefined,
            isUserSduTrialEligible: true,
            reorderFulfillmentOptionsPdp: false,
            sddRadioButtonDisabled: false,
            shippingMethodNotAvailable: false,
            shouldSelectAutoReplenish: false,
            showBopisSelectorCopyOnPdp: false,
            signInText: 'Sign in'
        };

        // Act
        const data = fields(state, ownProps);

        // Assert
        expect(data).toStrictEqual(expect.objectContaining(requiredFields));
    });
});
