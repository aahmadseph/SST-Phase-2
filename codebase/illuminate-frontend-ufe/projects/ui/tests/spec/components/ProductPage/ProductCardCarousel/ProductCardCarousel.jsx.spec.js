// /* eslint-disable no-unused-vars */
// const { shallow } = require('enzyme');
// const ProductCardCarousel = require('components/ProductPage/ProductCardCarousel/ProductCardCarousel').default;
// const React = require('react');
// const anaConsts = require('analytics/constants').default;
// const processEvent = require('analytics/processEvent').default;
// const { site, space } = require('style/config');
// const { CARD_GAP } = require('constants/productCard');

// describe('ProductCardCarousel component', () => {
//     it('should render most outer element with data-at attribute set to "product_carousel"', () => {
//         // Arrange
//         const props = { skus: [{ skuId: 0 }] };

//         // Act
//         const wrapper = shallow(<ProductCardCarousel {...props} />);

//         // Assert
//         expect(wrapper.find('[data-at="product_carousel"]').exists()).toBe(true);
//     });

//     it('title should render with data-at attribute set to "product_carousel_title"', () => {
//         // Arrange
//         const props = { skus: [{ skuId: 0 }] };

//         // Act
//         const wrapper = shallow(<ProductCardCarousel {...props} />);

//         // Assert
//         expect(wrapper.find('[data-at="product_carousel_title"]').exists()).toBe(true);
//     });

//     it('should render LazyLoad with RCarousel as component', () => {
//         // Arrange
//         const props = { skus: [{ skuId: 0 }] };

//         // Act
//         const wrapper = shallow(<ProductCardCarousel {...props} />);

//         // Assert
//         const LazyLoadComponent = wrapper.find('LazyLoad');
//         const component = LazyLoadComponent.prop('component');
//         expect(component.componentName).toBe('Carousel');
//     });

//     it('should render an Link in case a link is present in props', () => {
//         // Arrange
//         const props = {
//             skus: [{ skuId: 0 }],
//             link: { href: 'https://test.com' }
//         };

//         // Act
//         const wrapper = shallow(<ProductCardCarousel {...props} />);

//         // Assert
//         expect(wrapper.find('Link[href="https://test.com"]').exists()).toBe(true);
//     });
// });
