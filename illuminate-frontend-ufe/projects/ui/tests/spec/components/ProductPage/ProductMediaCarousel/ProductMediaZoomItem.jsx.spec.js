// const React = require('react');
// const { shallow } = require('enzyme');
// const { MEDIA_TYPE } = require('analytics/constants').default;
// const ProductMediaZoomItem = require('components/ProductPage/ProductMediaCarousel/ProductMediaZoomItem').default;

// describe('<ProductMediaZoomItem />', () => {
//     let mediaItem;
//     let mediaItemIndex;
//     let product;

//     beforeEach(() => {
//         mediaItem = {
//             media: '',
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
//     });

//     it('should render HeroVideo button if mediaType is Video and it is not Thumbnail', () => {
//         // Arrange
//         mediaItem.type = MEDIA_TYPE.VIDEO;
//         const component = shallow(
//             <ProductMediaZoomItem
//                 mediaItem={mediaItem}
//                 product={product}
//                 mediaItemIndex={mediaItemIndex}
//             />
//         );

//         // Act
//         const button = component.findWhere(x => x.name() === 'button' && x.key() !== mediaItemIndex.toString());

//         // Assert
//         expect(button.exists()).toBeTruthy();
//     });

//     it('should render Thumbnail button if mediaType is Video but it is Thumbnail', () => {
//         // Arrange
//         mediaItem.type = MEDIA_TYPE.VIDEO;
//         const component = shallow(
//             <ProductMediaZoomItem
//                 mediaItem={mediaItem}
//                 product={product}
//                 mediaItemIndex={mediaItemIndex}
//                 isThumbnail={true}
//             />
//         );

//         // Act
//         const button = component.findWhere(x => x.name() === 'button' && x.key() === mediaItemIndex.toString());

//         // Assert
//         expect(button.exists()).toBeTruthy();
//     });

//     it('should render Thumbnail button if MediaType is not Video', () => {
//         // Arrange
//         const component = shallow(
//             <ProductMediaZoomItem
//                 mediaItem={mediaItem}
//                 product={product}
//                 mediaItemIndex={mediaItemIndex}
//             />
//         );

//         // Act
//         const button = component.findWhere(x => x.name() === 'button' && x.key() === mediaItemIndex.toString());

//         // Assert
//         expect(button.exists()).toBeTruthy();
//     });
// });
