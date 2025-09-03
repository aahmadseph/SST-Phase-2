const React = require('react');
const { shallow } = require('enzyme');
const CustomSets = require('components/ProductPage/CustomSets/CustomSets').default;

describe('<CustomSets />', () => {
    let props;

    beforeEach(() => {
        props = {
            currentSku: {
                configurableOptions: {
                    groupedSkuOptions: [
                        {
                            choiceSelected: {},
                            skuOptions: [{}],
                            groupProduct: { brand: { displayName: 'SomeDisplayName' } }
                        }
                    ]
                }
            },
            currentProduct: { productDetails: { productId: 12345 } }
        };
    });

    describe('render', () => {
        it('should render data-at', () => {
            const component = shallow(<CustomSets {...props} />, { disableLifecycleMethods: true });

            expect(component.find('[data-at="pdp_custom_set_block"]').exists()).toEqual(true);
        });
    });
});
