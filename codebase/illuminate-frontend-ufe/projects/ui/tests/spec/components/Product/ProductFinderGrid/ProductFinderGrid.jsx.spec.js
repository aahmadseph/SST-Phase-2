const React = require('react');
const { shallow } = require('enzyme');

describe('ProductFinderGrid component', () => {
    let ProductFinderGrid;
    let props;
    let wrapper;
    let ProductItemElem;

    beforeEach(() => {
        props = {
            // prettier-ignore
            products: [{ 'sku_number': '2179158' }]
        };
        ProductFinderGrid = require('components/ProductFinderGrid/ProductFinderGrid').default;
        wrapper = shallow(<ProductFinderGrid {...props} />);
    });

    it('contains <ProductItem /> component', () => {
        ProductItemElem = wrapper.findWhere(n => n.name() === 'ErrorBoundary(Connect(ProductItem))');
        expect(ProductItemElem.length).toEqual(1);
    });
});
