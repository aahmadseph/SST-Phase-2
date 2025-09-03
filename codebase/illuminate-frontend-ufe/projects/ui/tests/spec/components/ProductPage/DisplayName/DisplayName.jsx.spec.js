const React = require('react');
const { shallow } = require('enzyme');
const DisplayName = require('components/ProductPage/DisplayName/DisplayName').default;

describe('<DisplayName />', () => {
    let props;
    let product;

    beforeEach(() => {
        product = {
            displayName: 'SomeProductDisplayName',
            brand: { displayName: 'SomeBrandDisplayName' }
        };
        props = { productDisplayNameDataAt: 'SomeDataAt' };
    });

    describe('render', () => {
        it('should render Text with a valid productDisplayNameDataAt', () => {
            const component = shallow(
                <DisplayName
                    product={product}
                    {...props}
                />,
                { disableLifecycleMethods: true }
            );

            const element = component.findWhere(x => x.name() === 'Text' && x.prop('data-at') === props.productDisplayNameDataAt);

            expect(element.exists()).toBeTruthy();
        });

        it('should render Text with product_name if productDisplayNameDataAt is not present', () => {
            props = {};
            const component = shallow(
                <DisplayName
                    product={product}
                    {...props}
                />,
                { disableLifecycleMethods: true }
            );

            const element = component.findWhere(x => x.name() === 'Text' && x.prop('data-at') === 'product_name');

            expect(element.exists()).toBeTruthy();
        });
    });
});
