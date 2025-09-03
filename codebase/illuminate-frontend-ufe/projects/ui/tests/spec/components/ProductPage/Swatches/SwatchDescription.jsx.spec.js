// const React = require('react');
// const { shallow } = require('enzyme');
// const SwatchDescription = require('components/ProductPage/Swatches/SwatchDescription').default;
// const skuUtils = require('utils/Sku').default;

// describe('<SwatchDescription />', () => {
//     describe('Render', () => {
//         it('should render badge for Single-sized SKU', () => {
//             // Arrange
//             const component = shallow(<SwatchDescription />, { disableLifecycleMethods: true });

//             // Act
//             component.setState({
//                 product: {
//                     currentSku: {
//                         variationType: skuUtils.skuVariationType.NONE,
//                         isOnlyFewLeft: true
//                     }
//                 }
//             });

//             // Assert
//             expect(component.find('Flag').length).toEqual(1);
//         });

//         it('should render no badges if isOnlyFewLeft flag is not presented', () => {
//             // Arrange
//             const component = shallow(<SwatchDescription />, { disableLifecycleMethods: true });

//             // Act
//             component.setState({ product: { currentSku: { variationType: skuUtils.skuVariationType.NONE } } });

//             // Assert
//             expect(component.find('Flag').length).toEqual(0);
//         });
//     });
// });
