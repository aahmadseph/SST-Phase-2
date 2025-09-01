// /* eslint-disable object-curly-newline */
// describe('OrderItem component', () => {
//     let React;
//     const { objectContaining } = jasmine;
//     // eslint-disable-next-line no-undef
//     const shallow = enzyme.shallow;
//     let getText;
//     let analyticsConstants;
//     let skuUtils;
//     let shallowComponent;
//     let OrderItem;
//     const props = {
//         item: {
//             modifiable: true,
//             qty: 2,
//             sku: {
//                 targetUrl: null,
//                 type: 'BI',
//                 productId: 'P0001',
//                 brandName: 'someBrand',
//                 productName: 'productName',
//                 salePrice: '$8.00',
//                 listPrice: '$7.00',
//                 fullSizeSku: {}
//             },
//             product: {
//                 heroImageAltText: 'some altText'
//             },
//             itemTotal: '100'
//         },
//         itemWithTargetUrl: {
//             modifiable: true,
//             qty: 2,
//             sku: {
//                 targetUrl: 'http://google.com',
//                 type: 'BI',
//                 productId: 'P0001',
//                 brandName: 'someBrand',
//                 productName: 'productName',
//                 salePrice: '$8.00',
//                 listPrice: '$7.00'
//             },
//             product: {
//                 heroImageAltText: 'some altText'
//             },
//             itemTotal: '100'
//         }
//     };

//     beforeEach(() => {
//         React = require('react');
//         // eslint-disable-next-line no-undef
//         getText = enzyme.getText;
//         analyticsConstants = require('analytics/constants').default;
//         skuUtils = require('utils/Sku').default;
//         OrderItem = require('components/OrderConfirmation/OrderItemList/OrderItem/OrderItem').default;
//     });

//     describe('getPriceDisplay', () => {
//         const PRICE_GRIDCELL_INDEX = 4;

//         describe('with salePrice', () => {
//             beforeEach(() => {
//                 shallowComponent = shallow(<OrderItem item={props.item} />);
//             });

//             it('should render subtotal price', () => {
//                 const priceElem = shallowComponent.find('LegacyGridCell').at(PRICE_GRIDCELL_INDEX);
//                 expect(priceElem.props().dangerouslySetInnerHTML.__html).toEqual(props.item.sku.salePrice);
//             });
//         });
//     });

//     describe('for desktop', () => {
//         beforeEach(() => {
//             shallowComponent = shallow(<OrderItem item={props.item} />);
//         });

//         it('should have a product image', () => {
//             const ProductImages = shallowComponent.find('ProductImage');
//             expect(ProductImages.length).toBe(1);
//         });

//         it('should have size and item number', () => {
//             const SizeAndItemNumber = shallowComponent.find('SizeAndItemNumber');
//             expect(SizeAndItemNumber.length).toBe(1);
//         });

//         it('should have product variation', () => {
//             const ProductVariation = shallowComponent.find('ProductVariation');
//             expect(ProductVariation.length).toBe(1);
//         });

//         it('should render Brand Name', () => {
//             const brandNameBoxIndex = 2;
//             const brandName = shallowComponent.find('Box').at(brandNameBoxIndex);
//             expect(getText(brandName)).toEqual(props.item.sku.brandName);
//         });

//         it('should not render quantity of the item at the end', () => {
//             const qtyDesktopIndex = 5;
//             const qtyElem = shallowComponent.find('LegacyGridCell').at(qtyDesktopIndex);
//             expect(getText(qtyElem)).toEqual(props.item.qty.toString());
//         });

//         it('should render subtotal price', () => {
//             const priceElem = shallowComponent.find('LegacyGridCell').at(4);
//             expect(priceElem.props().dangerouslySetInnerHTML.__html).toEqual(props.item.sku.salePrice);
//         });

//         it('should set props property "analyticsContext" of AddToBasketButton component to CONTEXT.ORDER_CONFIRMATION when render', () => {
//             // Arrange
//             spyOn(Sephora, 'isMobile').and.returnValue(false);
//             spyOn(skuUtils, 'isBiReward').and.returnValue(true);
//             const {
//                 CONTEXT: { ORDER_CONFIRMATION }
//             } = analyticsConstants;

//             // Act
//             const wrapper = shallow(<OrderItem {...props} />);

//             // Assert
//             expect(wrapper.find('ErrorBoundary(Connect(AddToBasketButton))').props()).toEqual(
//                 objectContaining({ analyticsContext: ORDER_CONFIRMATION })
//             );
//         });
//     });

//     describe('for mobile', () => {
//         beforeEach(() => {
//             spyOn(Sephora, 'isMobile').and.returnValue(true);
//             shallowComponent = shallow(<OrderItem item={props.item} />);
//         });

//         it('should have a product image', () => {
//             const ProductImages = shallowComponent.find('ProductImage');
//             expect(ProductImages.length).toBe(1);
//         });

//         it('should have size and item number', () => {
//             const SizeAndItemNumber = shallowComponent.find('SizeAndItemNumber');
//             expect(SizeAndItemNumber.length).toBe(1);
//         });

//         it('should have product variation', () => {
//             const ProductVariation = shallowComponent.find('ProductVariation');
//             expect(ProductVariation.length).toBe(1);
//         });

//         it('should render Brand Name', () => {
//             const brandNameBoxIndex = 2;
//             const brandName = shallowComponent.find('Box').at(brandNameBoxIndex);
//             expect(getText(brandName)).toEqual(props.item.sku.brandName);
//         });
//     });

//     describe('OrderItem with targetUrl', () => {
//         beforeEach(() => {
//             shallowComponent = shallow(<OrderItem item={props.itemWithTargetUrl} />);
//         });

//         it('should have a link', () => {
//             const ProductImages = shallowComponent.find('Link');
//             expect(ProductImages.length).toBe(1);
//         });
//     });
// });
