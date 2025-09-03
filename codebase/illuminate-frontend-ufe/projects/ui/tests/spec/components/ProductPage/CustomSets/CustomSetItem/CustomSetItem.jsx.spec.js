const React = require('react');
const { shallow } = require('enzyme');
const CustomSetItem = require('components/ProductPage/CustomSets/CustomSetItem/CustomSetItem').default;

describe('<CustomSetItem />', () => {
    let props;

    beforeEach(() => {
        props = {
            skuIndex: 0,
            sku: {
                selectedSku: {
                    skuId: 12345,
                    isOutOfStock: false,
                    isAppExclusive: false
                },
                skuOptions: []
            }
        };
    });

    describe('render', () => {
        it('should render SwatchGroup with a valid customSetDataAt', () => {
            const component = shallow(<CustomSetItem {...props} />, { disableLifecycleMethods: true });

            const element = component.findWhere(
                x => x.name() === 'SwatchGroup' && x.prop('customSetDataAt') === 'pdp_custom_set_free_product_swatch'
            );

            expect(element.exists()).toBeTruthy();
        });
    });
});
