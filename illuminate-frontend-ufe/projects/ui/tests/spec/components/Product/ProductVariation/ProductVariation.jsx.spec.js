/* eslint-disable object-curly-newline */
describe('ProductVariation component', () => {
    let React;
    // eslint-disable-next-line no-undef
    let shallow;
    let ProductVariation;
    let dataAtFunc;

    beforeEach(() => {
        React = require('react');
        // eslint-disable-next-line no-undef
        shallow = enzyme.shallow;
        ProductVariation = require('components/Product/ProductVariation/ProductVariation').default;

        // Arrange
        dataAtFunc = spyOn(Sephora.debug, 'dataAt');
        const props = {
            product: {
                variationType: 'Size + Concentration + Formulation'
            },
            sku: {
                variationValue: 'Whatever'
            }
        };
        shallow(<ProductVariation {...props} />);
    });

    it('component should contain "data-at" attribute set to "item_variation_type"', () => {
        // Assert
        expect(dataAtFunc.calls.all().some(call => call.args[0] === 'item_variation_type')).toBeTruthy();
    });
});
