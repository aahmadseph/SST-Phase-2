const CustomSets = require('components/ProductPage/CustomSets/CustomSets').default;

describe('CustomSets component', () => {
    it('should update state when component rerendered with new sku', () => {
        // Arrange
        const state = { skuId: 1 };
        const newProps = {
            currentSku: {
                configurableOptions: {
                    groupedSkuOptions: [
                        {
                            skuOptions: [{}],
                            groupProduct: {
                                brand: { displayName: 'displayName' },
                                displayName: 'displayName'
                            },
                            choiceSelected: true
                        }
                    ]
                },
                skuId: 2
            }
        };
        const [skuOption] = newProps.currentSku.configurableOptions.groupedSkuOptions;
        const option = {
            isExpanded: false,
            groupProduct: skuOption.groupProduct,
            selectedSku: { primaryProduct: { ...skuOption.groupProduct } },
            skuOptions: skuOption.skuOptions
        };
        const newState = {
            lastSelectedSku: option.selectedSku,
            skuId: 2,
            skuOptions: [option]
        };

        // Act
        const result = CustomSets.getDerivedStateFromProps(newProps, state);

        // Assert
        expect(result).toEqual(newState);
    });
});
