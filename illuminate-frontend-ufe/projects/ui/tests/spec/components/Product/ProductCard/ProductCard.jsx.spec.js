// const React = require('react');
// const { objectContaining } = jasmine;
// const { shallow } = require('enzyme');
// const ProductCard = require('components/Product/ProductCard/ProductCard').default;
// const analyticsUtils = require('analytics/utils').default;
// const ADD_BUTTON_TYPE = require('utils/Basket').default.ADD_TO_BASKET_TYPES;
// const Location = require('utils/Location').default;
// const skuUtils = require('utils/Sku').default;
// const helpersUtils = require('utils/Helpers').default;

// const { deferTaskExecution } = helpersUtils;

// describe('ProductCard component', () => {
//     describe('click', () => {
//         let props;
//         let setNextPageDataSpy;
//         let navigateToSpy;
//         beforeEach(() => {
//             props = {
//                 sku: {
//                     productId: 'P377873',
//                     targetUrl: 'whatever'
//                 },
//                 analyticsContext: 'analyticsContext',
//                 openRewardsBazaarModal: () => {}
//             };
//             setNextPageDataSpy = spyOn(analyticsUtils, 'setNextPageData');
//         });

//         it('should invoke setNextPageData with a valid data if parentTitle is not present', async () => {
//             // Arrange
//             const internalCampaign = `${props.analyticsContext.toLowerCase()}:${props.sku.productId.toLowerCase()}:product`;
//             navigateToSpy = spyOn(Location, 'navigateTo');

//             // Act
//             shallow(<ProductCard {...props} />).simulate('click');

//             // Wait for async tasks to complete
//             await new Promise(resolve => deferTaskExecution(resolve));

//             // Assert
//             expect(setNextPageDataSpy).toHaveBeenCalledWith(
//                 objectContaining({
//                     internalCampaign,
//                     recInfo: {
//                         isExternalRec: 'sephora',
//                         componentTitle: ''
//                     }
//                 })
//             );
//             expect(navigateToSpy).toHaveBeenCalled();
//         });

//         it('should invoke setNextPageData with a valid data if parentTitle is present', async () => {
//             // Arrange
//             props.parentTitle = 'use it with';
//             const internalCampaign = `${props.parentTitle.toLowerCase()}:${props.sku.productId.toLowerCase()}:product`;
//             navigateToSpy = spyOn(Location, 'navigateTo');

//             // Act
//             shallow(<ProductCard {...props} />).simulate('click');

//             // Wait for async tasks to complete
//             await new Promise(resolve => deferTaskExecution(resolve));

//             // Assert
//             expect(setNextPageDataSpy).toHaveBeenCalledWith(
//                 objectContaining({
//                     internalCampaign,
//                     recInfo: {
//                         isExternalRec: 'sephora',
//                         componentTitle: 'use it with'
//                     }
//                 })
//             );
//             expect(navigateToSpy).toHaveBeenCalled();
//         });
//     });

//     it('should pass all required props to AddToBasketButton component', () => {
//         // Arrange
//         const props = {
//             showAddButton: true,
//             sku: { listPrice: 123 },
//             analyticsContext: 'analyticsContext',
//             rootContainerName: undefined,
//             localization: { free: 'FREE' },
//             showBasketCarouselErrorModal: false,
//             disabled: false,
//             ctaTwoLines: true,
//             isRougeExclusiveCarousel: true
//         };

//         spyOn(skuUtils, 'isFree').and.returnValue(false);

//         // Act
//         const wrapper = shallow(<ProductCard {...props} />);

//         // Assert
//         const addToBasketButton = wrapper
//             .find('div')
//             .at(1)
//             .shallow()
//             .find('ProductCardCTA')
//             .shallow()
//             .find('ErrorBoundary(Connect(AddToBasketButton))');

//         expect(addToBasketButton.props()).toEqual({
//             sku: props.sku,
//             variant: ADD_BUTTON_TYPE.SECONDARY,
//             isAddButton: true,
//             size: 'sm',
//             analyticsContext: 'analyticsContext',
//             rootContainerName: undefined,
//             showBasketCarouselErrorModal: false,
//             disabled: false,
//             ctaTwoLines: true,
//             isRougeExclusiveCarousel: true,
//             triggerAnalytics: jasmine.any(Function)
//         });
//     });
// });
