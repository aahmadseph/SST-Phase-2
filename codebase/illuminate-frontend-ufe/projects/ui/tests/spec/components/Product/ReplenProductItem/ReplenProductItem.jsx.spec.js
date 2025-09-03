describe('<ReplenProductItem /> component', () => {
    let React;
    let ReplenProductItem;
    let shallowedComponent;

    const props = {
        sku: {
            targetUrl: 'target_url',
            productId: 'product_id',
            productName: 'product_name',
            skuImages: []
        },
        parentTitle: 'Carousel title'
    };

    beforeEach(() => {
        React = require('react');
        ReplenProductItem = require('components/Product/ReplenProductItem/ReplenProductItem').default;
        shallowedComponent = enzyme.shallow(<ReplenProductItem {...props} />);
    });

    it('should render the main anchor element', () => {
        expect(shallowedComponent.find('ProductQuicklook').length).toBe(1);
    });

    it('should render the ProductImage element', () => {
        expect(shallowedComponent.find('ProductImage').length).toBe(1);
    });

    it('should render the ProductQuicklook element', () => {
        expect(shallowedComponent.find('ProductQuicklook').length).toBe(1);
    });

    it('should render the AddToBasketButton element', () => {
        expect(shallowedComponent.find('ErrorBoundary(Connect(AddToBasketButton))').length).toBe(1);
    });

    it('should pass parentTitle to ProductQuicklook', () => {
        expect(shallowedComponent.find('ProductQuicklook').prop('productStringContainerName')).toBe('carousel_title');
    });
});
