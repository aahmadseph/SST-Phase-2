const React = require('react');
const { shallow } = require('enzyme');
const Info = require('components/ProductPage/Info/Info').default;

describe('<Info />', () => {
    let props;

    beforeEach(() => {
        props = {
            currentSku: { skuId: '123' },
            product: { parentCategory: { categoryId: 2 } }
        };
    });

    describe('Item id', () => {
        it('should render correct data-at attribute', () => {
            // Arrange
            const component = shallow(
                <Info
                    title='InfoComponent'
                    description='Description'
                    {...props}
                />,
                { disableLifecycleMethods: true }
            );
            const textElement = component.find('Text[data-at="item_sku"]');

            // Assert
            expect(textElement.exists()).toBe(true);
        });
    });

    describe('Title text component', () => {
        it('should render correct data-at attribute', () => {
            // Arrange
            const component = shallow(
                <Info
                    title='InfoComponent'
                    description='Description'
                    {...props}
                    dataAt='about_the_product_title'
                />,
                { disableLifecycleMethods: true }
            );
            const textElement = component.find('Text[data-at="about_the_product_title"]');

            // Assert
            expect(textElement.exists()).toBe(true);
        });
    });
});
