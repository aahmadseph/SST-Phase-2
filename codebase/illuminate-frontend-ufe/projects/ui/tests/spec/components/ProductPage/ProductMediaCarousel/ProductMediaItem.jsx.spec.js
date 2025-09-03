// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');
// const { MEDIA_TYPE } = require('analytics/constants').default;
// const ProductMediaItem = require('components/ProductPage/ProductMediaCarousel/ProductMediaItem').default;

// describe('<ProductMediaItem />', () => {
//     let product;
//     let mediaItemIndex;
//     let mediaItem;
//     let props;

//     beforeEach(() => {
//         mediaItem = {
//             media: { startImagePath: 'path' },
//             type: ''
//         };
//         mediaItemIndex = 0;
//         product = {
//             currentSku: {
//                 alternateImages: [
//                     {
//                         altText: 'SEPHORA',
//                         image43: '/prouctImage/product/abc.jpg'
//                     }
//                 ]
//             },
//             productDetails: {
//                 brand: { displayName: 'Fenty' },
//                 displayName: 'Lipstick'
//             }
//         };
//         props = {
//             onClick: () => {}
//         };
//     });

//     it('should render empty div if mediaType is neither Video or Image', () => {
//         // Arrange
//         const component = shallow(
//             <ProductMediaItem
//                 item={mediaItem}
//                 {...props}
//             />
//         );

//         // Act
//         const div = component.find('div');

//         // Assert
//         expect(div.children().length).toEqual(0);
//     });

//     // it('should render Image if mediaType is Image and it is Thumbnail', () => {
//     //     // Arrange
//     //     mediaItem.type = MEDIA_TYPE.IMAGE;
//     //     const component = shallow(
//     //         <ProductMediaItem
//     //             item={mediaItem}
//     //             isThumbnail={true}
//     //             {...props}
//     //         />
//     //     );

//     //     // Act
//     //     const productImage = component.find('Image');

//     //     // Assert
//     //     expect(productImage.exists()).toBeTruthy();
//     // });

//     it('should render ProductImage if mediaType is Image and it is FullWidth', () => {
//         // Arrange
//         mediaItem.type = MEDIA_TYPE.IMAGE;
//         const component = shallow(
//             <ProductMediaItem
//                 item={mediaItem}
//                 isFullWidth={true}
//                 {...props}
//             />
//         );

//         // Act
//         const productImage = component.find('ProductImage');

//         // Assert
//         expect(productImage.exists()).toBeTruthy();
//     });

//     it('should render button if mediaType is Image and it is neither Thumbnail or FullWidth', () => {
//         // Arrange
//         mediaItem.type = MEDIA_TYPE.IMAGE;
//         const component = shallow(
//             <ProductMediaItem
//                 item={mediaItem}
//                 {...props}
//             />
//         );

//         // Act
//         const button = component.find('button');

//         // Assert
//         expect(button.exists()).toBeTruthy();
//     });

//     it('should render BccVideo if mediaType is Video', () => {
//         // Arrange
//         mediaItem.type = MEDIA_TYPE.VIDEO;
//         const component = shallow(
//             <ProductMediaItem
//                 item={mediaItem}
//                 {...props}
//             />
//         );

//         // Act
//         const bccVideo = component.find('BccVideo');

//         // Assert
//         expect(bccVideo.exists()).toBeTruthy();
//     });
// });
