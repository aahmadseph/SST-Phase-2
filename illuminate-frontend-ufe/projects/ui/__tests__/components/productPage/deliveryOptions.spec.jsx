import { render } from 'test-utils';
import DeliveryOptions from 'components/ProductPage/DeliveryOptions';
import mockState from '__mocks__/pageData/productPage/cream-lip-stain-liquid-lipstick-P281411_DeliveryOptions.json';
import ssrState from '__mocks__/pageData/productPage/cream-lip-stain-liquid-lipstick-P281411.json';

describe('DeliveryOptions component', () => {
    test('should render with SSR data', async () => {
        // Arrange
        const ssrData = 'FREE standard shipping';

        // Act
        const { getByText } = render(
            <DeliveryOptions
                currentProduct={ssrState.page.product}
                serviceUnavailable={false}
            />,
            { redux: ssrState }
        );

        // Assert
        expect(getByText(ssrData)).toBeInTheDocument();
    });

    describe('', () => {
        let state;

        beforeEach(async () => {
            // Create a deep copy - don't use JSON.parse(JSON.stringify( as it's 2 times slower
            state = window.structuredClone(mockState);
        });

        test('should render with p13n data', async () => {
            // Arrange
            const p13Data = 'Delivery by Thu, Apr 10 to 95124';

            // Act
            const { getByText } = render(
                <DeliveryOptions
                    currentProduct={state.page.product}
                    serviceUnavailable={false}
                />,
                { redux: state }
            );

            // Assert
            expect(getByText(p13Data)).toBeInTheDocument();
        });
    });
});
