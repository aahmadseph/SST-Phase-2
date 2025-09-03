const { shallow } = require('enzyme');
const ProductPageSEO = require('components/ProductPage/ProductPageSEO/ProductPageSEO').default;
const React = require('react');

describe('ProductPageSEO component', () => {
    it('should render script tag for breadcrumbsSeoJsonLd when property provided', () => {
        // Arrange
        const props = { product: { schemas: ['breadcrumbsSeoJsonLd'] } };
        const element = (
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: props.schemas[0] }}
            />
        );

        // Act
        const wrapper = shallow(<ProductPageSEO {...props} />);

        // Assert
        expect(wrapper.containsMatchingElement(element)).toEqual(true);
    });

    it('should render script tag for navigationSeoJsonLd when property provided', () => {
        // Arrange
        const props = { product: { schemas: ['navigationSeoJsonLd'] } };
        const element = (
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: props.schemas[0] }}
            />
        );

        // Act
        const wrapper = shallow(<ProductPageSEO {...props} />);

        // Assert
        expect(wrapper.containsMatchingElement(element)).toEqual(true);
    });

    it('should render script tag for productSeoJsonLd when property provided', () => {
        // Arrange
        const props = { product: { schemas: ['productSeoJsonLd'] } };
        const element = (
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: props.schemas[0] }}
            />
        );

        // Act
        const wrapper = shallow(<ProductPageSEO {...props} />);

        // Assert
        expect(wrapper.containsMatchingElement(element)).toEqual(true);
    });

    it('should not render component again with same props', () => {
        // Arrange
        const props = {
            product: {
                schemas: ['breadcrumbsSeoJsonLd', 'navigationSeoJsonLd', 'productSeoJsonLd']
            }
        };

        // Act
        const wrapper = shallow(<ProductPageSEO {...props} />);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setProps(props);

        // Assert
        expect(render).toHaveBeenCalledTimes(0);
    });

    it('should re-render component only once when breadcrumbsSeoJsonLd property has changed', () => {
        // Arrange
        const props = {
            product: {
                schemas: ['breadcrumbsSeoJsonLd', 'navigationSeoJsonLd', 'productSeoJsonLd']
            }
        };
        const newProps = {
            product: {
                ...props.product,
                schemas: ['breadcrumbsSeoJsonLd_2', 'navigationSeoJsonLd', 'productSeoJsonLd']
            }
        };

        // Act
        const wrapper = shallow(<ProductPageSEO {...props} />);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setProps(newProps);
        wrapper.setProps(newProps);

        // Assert
        expect(render).toHaveBeenCalledTimes(1);
    });

    it('should re-render component only once when navigationSeoJsonLd property has changed', () => {
        // Arrange
        const props = {
            product: {
                schemas: ['breadcrumbsSeoJsonLd', 'navigationSeoJsonLd', 'productSeoJsonLd']
            }
        };
        const newProps = {
            product: {
                ...props.product,
                schemas: ['breadcrumbsSeoJsonLd', 'navigationSeoJsonLd_2', 'productSeoJsonLd']
            }
        };

        // Act
        const wrapper = shallow(<ProductPageSEO {...props} />);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setProps(newProps);
        wrapper.setProps(newProps);

        // Assert
        expect(render).toHaveBeenCalledTimes(1);
    });

    it('should re-render component only once when productSeoJsonLd property has changed', () => {
        // Arrange
        const props = {
            product: {
                schemas: ['breadcrumbsSeoJsonLd', 'navigationSeoJsonLd', 'productSeoJsonLd']
            }
        };
        const newProps = {
            product: {
                ...props.product,
                schemas: ['breadcrumbsSeoJsonLd', 'navigationSeoJsonLd', 'productSeoJsonLd_2']
            }
        };

        // Act
        const wrapper = shallow(<ProductPageSEO {...props} />);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setProps(newProps);
        wrapper.setProps(newProps);

        // Assert
        expect(render).toHaveBeenCalledTimes(1);
    });
});
