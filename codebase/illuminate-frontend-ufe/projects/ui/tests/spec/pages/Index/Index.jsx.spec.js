// const React = require('react');
// const { shallow } = require('enzyme');
// const PageTemplateType = require('constants/PageTemplateType').default;

// describe('Index page', () => {
//     let Index;

//     beforeEach(() => {
//         const renderRootComponent = require('utils/framework/renderRootComponent');
//         spyOn(renderRootComponent, 'default').and.callFake(() => {});
//         Index = require('Index/Index');
//     });

//     it('Head of the page should receive current sku as input param to prepare the rendering logic', () => {
//         // Arrange
//         Sephora.linkSPA = {};
//         const props = {
//             templateInformation: { template: PageTemplateType.ProductPage },
//             headerFooterTemplate: {},
//             apiConfigurationData: {},
//             product: { currentSku: 123456 }
//         };

//         // Act
//         const wrapper = shallow(<Index {...props} />);

//         // Assert
//         const headWrapper = wrapper.find('Head');
//         const { productPageSku } = headWrapper.props();
//         expect(productPageSku).toEqual(props.product.currentSku);
//     });
// });
