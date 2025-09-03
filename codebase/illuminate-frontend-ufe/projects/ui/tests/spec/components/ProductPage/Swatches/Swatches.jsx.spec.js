const React = require('react');
const { shallow } = require('enzyme');
const Swatches = require('components/ProductPage/Swatches/Swatches').default;
const skuUtils = require('utils/Sku').default;

describe('<Swatch />', () => {
    describe('Render', () => {
        it('should not render root div if skuSelectorType is not provided', () => {
            const currentProduct = { productDetails: { productId: 12345 } };

            // Arrange
            const component = shallow(<Swatches currentProduct={currentProduct} />);

            // Assert
            expect(component.find('div').exists()).toBeFalsy();
        });

        it('should render COLOR_SWATCH if skuSelectorType is not NONE', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.SIZE
            };

            // Arrange
            const component = shallow(<Swatches currentProduct={currentProduct} />);

            const colorSwatch = component.findWhere(x => x.prop('id') === skuUtils.ARIA_DESCRIBED_BY_IDS.COLOR_SWATCH);

            // Assert
            expect(colorSwatch.exists()).toBeTruthy();
        });

        it('should not render COLOR_SWATCH if skuSelectorType is NONE', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.NONE
            };

            // Arrange
            const component = shallow(<Swatches currentProduct={currentProduct} />);

            const colorSwatch = component.findWhere(x => x.prop('id') === skuUtils.ARIA_DESCRIBED_BY_IDS.COLOR_SWATCH);

            // Assert
            expect(colorSwatch.exists()).toBeFalsy();
        });

        it('should render SIZE_SWATCH if skuSelectorType is not NONE', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.SIZE
            };

            // Arrange
            const component = shallow(<Swatches currentProduct={currentProduct} />);

            const sizeSwatch = component.findWhere(x => x.prop('id') === skuUtils.ARIA_DESCRIBED_BY_IDS.SIZE_SWATCH);

            // Assert
            expect(sizeSwatch.exists()).toBeTruthy();
        });

        it('should not render SIZE_SWATCH if skuSelectorType is NONE', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.NONE
            };

            // Arrange
            const component = shallow(<Swatches currentProduct={currentProduct} />);

            const sizeSwatch = component.findWhere(x => x.prop('id') === skuUtils.ARIA_DESCRIBED_BY_IDS.SIZE_SWATCH);

            // Assert
            expect(sizeSwatch.exists()).toBeFalsy();
        });

        it('should render SwatchDescription if it is not CustomSet and skuSelectorType is NONE', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.NONE
            };

            // Arrange
            const component = shallow(
                <Swatches
                    isCustomSet={false}
                    currentProduct={currentProduct}
                />
            );

            const swatchDescription = component.find('SwatchDescription');

            // Assert
            expect(swatchDescription.exists()).toBeTruthy();
        });

        it('should not render SwatchDescription if skuSelectorType is NONE but it is CustomSet', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.NONE
            };

            // Arrange
            const component = shallow(
                <Swatches
                    isCustomSet={true}
                    currentProduct={currentProduct}
                />
            );

            const swatchDescription = component.find('SwatchDescription');

            // Assert
            expect(swatchDescription.exists()).toBeFalsy();
        });

        it('should render SwatchGrid if it is not CustomSet and skuSelectorType is not NONE', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.SIZE
            };

            // Arrange
            const component = shallow(
                <Swatches
                    isCustomSet={false}
                    currentProduct={currentProduct}
                />
            );

            const SwatchesDisplay = component.find('SwatchesDisplay');

            // Assert
            expect(SwatchesDisplay.exists()).toBeTruthy();
        });

        it('should not render SwatchGrid if skuSelectorType is not NONE but it is CustomSet', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.SIZE
            };

            // Arrange
            const component = shallow(
                <Swatches
                    isCustomSet={true}
                    currentProduct={currentProduct}
                />
            );

            const swatchGrid = component.find('SwatchGrid');

            // Assert
            expect(swatchGrid.exists()).toBeFalsy();
        });

        it('should render Wizard if ReverseLookup is Enabled', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.NONE,
                isReverseLookupEnabled: true
            };

            // Arrange
            const component = shallow(<Swatches currentProduct={currentProduct} />);

            const wizard = component.find('Wizard');

            // Assert
            expect(wizard.exists()).toBeTruthy();
        });

        it('should not render Wizard if ReverseLookup is not Enabled', () => {
            const currentProduct = {
                productDetails: { productId: 12345 },
                skuSelectorType: skuUtils.skuSwatchType.NONE,
                isReverseLookupEnabled: false
            };

            // Arrange
            const component = shallow(<Swatches currentProduct={currentProduct} />);

            const wizard = component.find('Wizard');

            // Assert
            expect(wizard.exists()).toBeFalsy();
        });
    });
});
