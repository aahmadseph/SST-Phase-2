// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { mount } = require('enzyme');

// describe('ItemsinOrder Component', () => {
//     let mountComponent;
//     let item;
//     let ItemsInOrder;
//     let ImageSizes;

//     beforeEach(() => {
//         ItemsInOrder = require('components/Checkout/OrderSummary/ItemsInOrder/ItemsInOrder').default;
//         ImageSizes = require('utils/BCC').default.IMAGE_SIZES;
//         item = {
//             isReplenishment: false,
//             sku: {
//                 brandName: 'Brand Name -',
//                 productName: 'Product Name',
//                 skuImages: {},
//                 skuId: '12345',
//                 isOnlyFewLeft: true
//             },
//             listPriceSubtotal: '$10.00',
//             qty: 2
//         };
//         mountComponent = mount(<ItemsInOrder item={item} />);
//     });

//     describe('product images', () => {
//         let productImageProps;

//         beforeEach(() => {
//             productImageProps = mountComponent.find('ProductImage').get(0).props;
//         });

//         it('should render lazy loaded Product Image with proper image size', () => {
//             expect(productImageProps.size).toEqual(ImageSizes[62]);
//         });

//         it('should render lazy loaded Product Image with proper images', () => {
//             expect(productImageProps.skuImages).toEqual(item.sku.skuImages);
//         });
//     });

//     describe('data at attributes', () => {
//         it('should render lazy loaded BasketItem LegacyGrid with proper data-at attribute', () => {
//             expect(mountComponent.find('LegacyGrid[data-at="basket_item"]').length).toEqual(1);
//         });

//         it('should render lazy loaded Product Image with proper data-at attribute', () => {
//             expect(mountComponent.find('ProductImage[data-at="item_picture"]').length).toEqual(1);
//         });

//         it('should render item data with data-at attribute', () => {
//             expect(mountComponent.find('LegacyGridCell[data-at="item_data"]').length).toEqual(1);
//         });

//         it('should render brand name with data-at attribute', () => {
//             expect(mountComponent.find('Box[data-at="item_brand_label"]').length).toEqual(1);
//         });

//         it('should render item size with data-at attribute', () => {
//             expect(mountComponent.find('SizeAndItemNumber[data-at="item_size_label"]').length).toEqual(1);
//         });

//         it('should render item quantity with data-at attribute', () => {
//             expect(mountComponent.find('Text[data-at="qty_label"]').length).toEqual(1);
//         });

//         it('should render item price with data-at attribute', () => {
//             expect(mountComponent.find('div[data-at="item_price"]').length).toEqual(1);
//         });
//     });

//     it('should render Brand Name', () => {
//         const brandName = mountComponent.find('Box').at(0);
//         expect(enzyme.getText(brandName)).toEqual(item.sku.brandName);
//     });

//     it('should render size and item number', () => {
//         const sizeAnsItemElem = mountComponent.find('SizeAndItemNumber').get(0);
//         expect(sizeAnsItemElem.props.sku).toEqual(item.sku);
//     });

//     it('should render product variation', () => {
//         const productVariationElem = mountComponent.find('ProductVariation').get(0);
//         expect(productVariationElem.props.sku).toEqual({
//             variationType: item.sku.variationType,
//             variationTypeDisplayName: item.sku.variationTypeDisplayName,
//             variationValue: item.sku.variationValue,
//             variationDesc: item.sku.variationDesc,
//             isOnlyFewLeft: item.sku.isOnlyFewLeft
//         });
//     });

//     it('should render quantity of the item', () => {
//         const qtyElem = mountComponent.find('Flex').find('Text').at(0);
//         expect(enzyme.getText(qtyElem)).toEqual('Qty: ' + item.qty);
//     });

//     it('should render subtotal price', () => {
//         const priceElem = mountComponent.find('Flex').find('div').at(0);
//         expect(priceElem.prop('children').props.children).toEqual(item.listPriceSubtotal);
//     });

//     describe('Sale Price', () => {
//         beforeEach(() => {
//             item = {
//                 sku: {
//                     brandName: 'Brand Name',
//                     productName: 'Product Name',
//                     skuImages: {},
//                     salePrice: '$8.00'
//                 },
//                 listPriceSubtotal: '$10.00',
//                 salePriceSubtotal: '$8.00',
//                 qty: 2
//             };
//             mountComponent = mount(<ItemsInOrder item={item} />);
//         });

//         it('should render subtotal price', () => {
//             const priceElem = mountComponent.find('Flex').find('Text').at(1);
//             expect(enzyme.getText(priceElem)).toEqual(item.listPriceSubtotal);
//         });

//         it('should render sale price', () => {
//             const priceElem = mountComponent.find('Flex').find('Text').at(2);
//             expect(enzyme.getText(priceElem)).toEqual(item.salePriceSubtotal);
//         });
//     });

//     describe('Only a few left flag', () => {
//         let wrapper;

//         it('should display <OnlyFewLeftFlag> component if it is a DC order', () => {
//             wrapper = mount(
//                 <ItemsInOrder
//                     isPickupOrder={false}
//                     item={item}
//                 />
//             );

//             const onlyFewLeftFlag = wrapper.find('OnlyFewLeftFlag');
//             expect(onlyFewLeftFlag.length).toEqual(1);
//         });

//         it('should display <OnlyFewLeftFlag> component if it is a DC order', () => {
//             wrapper = mount(
//                 <ItemsInOrder
//                     isPickupOrder={true}
//                     item={item}
//                 />
//             );

//             const onlyFewLeftFlag = wrapper.find('OnlyFewLeftFlag');
//             expect(onlyFewLeftFlag.length).toEqual(0);
//         });
//     });
// });
