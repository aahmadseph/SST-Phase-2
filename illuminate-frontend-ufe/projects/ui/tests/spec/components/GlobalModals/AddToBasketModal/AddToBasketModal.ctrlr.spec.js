// const { any } = jasmine;
// const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
// const { shallow } = require('enzyme');
// const React = require('react');
// const replaceSpecialCharacters = require('utils/replaceSpecialCharacters').default;

// const getText = getLocaleResourceFile('components/GlobalModals/AddToBasketModal/locales', 'AddToBasketModal');

// let AddToBasketModal;
// let wrapper;
// let component;
// let actions;
// let analyticsUtils;
// let processStub;
// let setAndWatchStub;
// let dispatchStub;
// let showAddToBasketModalStub;
// let showQuickLookModalStub;
// let setNextPageDataStub;
// let Location;

// const sku = {
//     disableLazyLoad: true,
//     showBadges: true,
//     showMarketingFlags: true,
//     showReviews: false,
//     showLoves: true,
//     showPrice: true,
//     formatValuePrice: false,
//     imageSize: 135,
//     useAddToBasket: true,
//     origin: null,
//     rootContainerName: 'Just_Arrived_nails_sku_grid',
//     productStringContainerName: 'skugrid',
//     biExclusiveLevel: 'none',
//     brandName: 'LANEIGE',
//     image: '/productimages/sku/s2210482-main-grid.jpg',
//     isAppExclusive: false,
//     isBiOnly: false,
//     isFirstAccess: false,
//     isFree: false,
//     isLimitedEdition: false,
//     isLimitedQuantity: false,
//     isLimitedTimeOffer: false,
//     isNaturalOrganic: false,
//     isNaturalSephora: false,
//     isNew: false,
//     isOnlineOnly: false,
//     isOutOfStock: false,
//     isSephoraExclusive: true,
//     listPrice: '$20.00',
//     productId: 'P443563',
//     productName: 'Lip Glowy Balm',
//     skuId: '2210482',
//     skuImages: {
//         image135: '/productimages/sku/s2210482-main-grid.jpg',
//         image162: '/productimages/sku/s2210482-162.jpg',
//         image250: '/productimages/sku/s2210482-main-hero.jpg',
//         image42: '/productimages/sku/s2210482-main-thumb.jpg',
//         image450: '/productimages/sku/s2210482-main-Lhero.jpg',
//         image62: '/productimages/sku/s2210482-main-Lthumb.jpg',
//         image97: '/productimages/sku/s2210482-main-Sgrid.jpg'
//     },
//     targetUrl: '/product/glowy-lip-balm-P443563?skuId=2210482',
//     actionFlags: { backInStockReminderStatus: 'inactive' },
//     isWithBackInStockTreatment: false,
//     type: 'standard'
// };

// const props = {
//     isOpen: true,
//     replenishmentSelected: false,
//     replenishmentFrequency: '',
//     isAutoReplenMostCommon: false,
//     sku: { ...sku }
// };

// const state = {
//     basket: {
//         itemCount: 2,
//         subtotal: '20.00',
//         pickupBasket: {
//             itemCount: 3,
//             rawSubTotal: '30.00'
//         }
//     }
// };

// describe('AddToBasketModal Component', () => {
//     beforeEach(() => {
//         const processEvent = require('analytics/processEvent').default;
//         const store = require('store/Store').default;
//         const skuUtils = require('utils/Sku').default;
//         actions = require('actions/Actions').default;
//         analyticsUtils = require('analytics/utils').default;
//         const Events = require('utils/framework/Events').default;

//         spyOn(Events, 'onLastLoadEvent').and.callFake(() => {});
//         spyOn(skuUtils, 'isBiReward').and.returnValue(true);
//         processStub = spyOn(processEvent, 'process');
//         setAndWatchStub = spyOn(store, 'setAndWatch');
//         dispatchStub = spyOn(store, 'dispatch');

//         setNextPageDataStub = spyOn(analyticsUtils, 'setNextPageData');

//         showAddToBasketModalStub = spyOn(actions, 'showAddToBasketModal').and.returnValue('showAddToBasketModal');
//         showQuickLookModalStub = spyOn(actions, 'showQuickLookModal').and.returnValue('showQuickLookModal');

//         AddToBasketModal = require('components/GlobalModals/AddToBasketModal/AddToBasketModal').default;
//         wrapper = shallow(<AddToBasketModal {...props} />);
//         wrapper.setState({ ...state });
//         component = wrapper.instance();
//     });

//     it('Modal.Title for ship to home', () => {
//         const text = getText('standardTitle');

//         const title = wrapper.findWhere(n => n.name() === 'ModalTitle' && n.props().children === text);

//         expect(title.length).toEqual(1);
//     });

//     it('Modal.Title for pickup item', () => {
//         // Arrange
//         const ExtraProductDetailsUtils = require('utils/ExtraProductDetailsUtils').default;
//         spyOn(ExtraProductDetailsUtils, 'availabilityLabel').and.returnValue('inStock');
//         const preferredStoreName = 'test store';
//         const text = getText('reserveTitle', [preferredStoreName]);

//         // Act
//         wrapper.setProps({ preferredStoreName });

//         // Assert
//         const modalTitleWrapper = wrapper.find('ModalTitle');
//         const modalTitleProps = modalTitleWrapper.props();
//         expect(modalTitleProps.children).toEqual(text);
//     });

//     it('should render product brand', () => {
//         const brand = wrapper.findWhere(n => n.name() === 'div' && n.prop('children') === sku.brandName);

//         expect(brand.length).toEqual(1);
//     });

//     it('should render product name', () => {
//         const name = wrapper.findWhere(n => n.name() === 'div' && n.prop('children') === sku.productName);

//         expect(name.length).toEqual(1);
//     });

//     it('should render product sku id', () => {
//         const skuIdWrapper = wrapper.findWhere(n => n.name() === 'Box' && n.prop('data-at') === 'atb_product_info');
//         const skuId = skuIdWrapper.children().at(2).text();

//         expect(skuId).toBe(sku.skuId);
//     });

//     it('should render ProductImage', () => {
//         const productImage = wrapper.findWhere(n => n.name() === 'ProductImage');

//         expect(productImage.length).toEqual(1);
//     });

//     it('should render ProductVariation', () => {
//         const productVariation = wrapper.findWhere(n => n.name() === 'ProductVariation');

//         expect(productVariation.length).toEqual(1);
//     });

//     it('should render ErrorList', () => {
//         wrapper.setState({ itemLevelMessages: ['error1'] });

//         const errorList = wrapper.findWhere(n => n.name() === 'ErrorList');

//         expect(errorList.length).toEqual(1);
//     });

//     it('should render Price', () => {
//         const price = wrapper.findWhere(n => n.name() === 'Price');

//         expect(price.length).toEqual(1);
//     });

//     it('should render proper item count for DC basket', () => {
//         wrapper.setProps({ preferredStoreName: false });

//         const itemCount = wrapper.find('SubtotalWithActionButtons').at(0).dive().find('BasketSubtotalInfo').at(0).dive().find('span').text();

//         expect(itemCount).toEqual(`Basket Subtotal (${state.basket.itemCount} items):`);
//     });

//     it('should render proper item count for Pickup basket', () => {
//         const ExtraProductDetailsUtils = require('utils/ExtraProductDetailsUtils').default;
//         spyOn(ExtraProductDetailsUtils, 'availabilityLabel').and.returnValue('inStock');
//         wrapper.setProps({ preferredStoreName: 'Test store' });

//         const itemCount = wrapper.find('SubtotalWithActionButtons').at(0).dive().find('BasketSubtotalInfo').at(0).dive().find('span').text();

//         expect(itemCount).toEqual(`Basket Subtotal (${state.basket.pickupBasket.itemCount} items):`);
//     });

//     it('should render proper subtotal for DC basket', () => {
//         wrapper.setProps({ preferredStoreName: false });

//         const subtotal = wrapper
//             .find('SubtotalWithActionButtons')
//             .at(0)
//             .dive()
//             .find('BasketSubtotalInfo')
//             .at(0)
//             .dive()
//             .find('strong')
//             .children()
//             .text();

//         expect(subtotal).toEqual(state.basket.subtotal);
//     });

//     it('should render proper subtotal for Pickup basket', () => {
//         const ExtraProductDetailsUtils = require('utils/ExtraProductDetailsUtils').default;
//         spyOn(ExtraProductDetailsUtils, 'availabilityLabel').and.returnValue('inStock');
//         wrapper.setProps({ preferredStoreName: 'Test store' });

//         const subtotal = wrapper
//             .find('SubtotalWithActionButtons')
//             .at(0)
//             .dive()
//             .find('BasketSubtotalInfo')
//             .at(0)
//             .dive()
//             .find('strong')
//             .children()
//             .text();

//         expect(subtotal).toEqual(state.basket.pickupBasket.rawSubTotal);
//     });

//     it('should render Go to checkout button set to variant="secondary" for ship to home item', () => {
//         const variant = wrapper.find('SubtotalWithActionButtons').at(0).dive().find('Button[data-at="atb_checkout"]').at(0).prop('variant');

//         expect(variant).toBe('secondary');
//     });

//     it('should render Go to checkout button set to variant="secondary" for pickup item', () => {
//         const ExtraProductDetailsUtils = require('utils/ExtraProductDetailsUtils').default;
//         spyOn(ExtraProductDetailsUtils, 'availabilityLabel').and.returnValue('inStock');
//         wrapper.setProps({ preferredStoreName: 'Test store' });

//         const variant = wrapper.find('SubtotalWithActionButtons').at(0).dive().find('Button[data-at="atb_checkout"]').at(0).prop('variant');

//         expect(variant).toBe('secondary');
//     });

//     it('should render Checkout Button', () => {
//         expect(wrapper.find('SubtotalWithActionButtons').at(0).dive().find('CheckoutButton').length).toEqual(1);
//     });

//     describe('componentDiMount', () => {
//         it('call fireATBPageLoadTracking', () => {
//             const productId = sku.productId;
//             const skuId = sku.skuId;
//             const name = sku.productName.toLowerCase();

//             expect(processStub).toHaveBeenCalledWith('asyncPageLoad', {
//                 data: {
//                     pageName: replaceSpecialCharacters(`add to basket modal:${productId}:n/a:*pname=${name}`),
//                     pageDetail: productId,
//                     previousPageName: '',
//                     pageType: 'add to basket modal',
//                     world: 'n/a',
//                     productStrings: `;${skuId};;;;eVar26=${skuId}`
//                 }
//             });
//         });

//         it('should call first setAndWatch with correct args', () => {
//             expect(setAndWatchStub.calls.argsFor(0)).toEqual(['basket', component, null, true]);
//         });

//         it('should call second setAndWatch with correct args', () => {
//             expect(setAndWatchStub.calls.argsFor(1)).toEqual(['basket.items', component, any(Function)]);
//         });

//         it('should call third setAndWatch with correct args', () => {
//             expect(setAndWatchStub.calls.argsFor(2)).toEqual(['user.preferredStoreInfo', component, any(Function)]);
//         });
//     });

//     describe('requestClose method with isContinueShopping set to False', () => {
//         beforeEach(() => {
//             const onDismiss = wrapper.find('Modal').prop('onDismiss');
//             onDismiss();
//         });

//         it('should dispatch an action to show modal', () => {
//             expect(dispatchStub).toHaveBeenCalled();
//         });

//         it('should call showAddToBasketModal', () => {
//             expect(dispatchStub).toHaveBeenCalledWith(actions.showAddToBasketModal({ isOpen: false }));
//         });

//         it('should call showQuickLookModal', () => {
//             expect(dispatchStub).toHaveBeenCalledWith(actions.showQuickLookModal({ isOpen: false }));
//         });

//         it('should call showAddToBaketModal Stub', () => {
//             expect(showAddToBasketModalStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call showAddToBaketModal Stub with arguments', () => {
//             expect(showAddToBasketModalStub).toHaveBeenCalledWith({ isOpen: false });
//         });

//         it('should call showAddToBaketModal Stub with arguments', () => {
//             expect(showAddToBasketModalStub).toHaveBeenCalledWith({ isOpen: false });
//         });

//         it('should call showQuickLookModal Stub', () => {
//             expect(showQuickLookModalStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call showQuickLookModal Stub with arguments', () => {
//             expect(showQuickLookModalStub).toHaveBeenCalledWith({ isOpen: false });
//         });

//         it('should call showQuickLookModal Stub with arguments', () => {
//             expect(showQuickLookModalStub).toHaveBeenCalledWith({ isOpen: false });
//         });
//     });

//     describe('setNextPageData method', () => {
//         beforeEach(() => {
//             spyOn(window, 'matchMedia').and.returnValue({ matches: true });
//             Location = require('utils/Location').default;
//             spyOn(Location, 'navigateTo');
//         });

//         it('Go to basket button should call setNextPageData with proper data', () => {
//             // Arrange
//             const event = {};
//             const productId = sku.productId;
//             const name = sku.productName;
//             const args = {
//                 pageName: replaceSpecialCharacters(`add to basket modal:${productId}:n/a:*pname=${name}`),
//                 linkData: 'add to basket modal:basket link'
//             };
//             wrapper.setProps({ preferredStoreName: false });
//             const linkWrapper = wrapper.find('Link[href="/basket"]');

//             // Act
//             linkWrapper.simulate('click', event);

//             // Assert
//             expect(setNextPageDataStub).toHaveBeenCalledWith(args);
//         });

//         it('View Basket button should call setNextPageData with proper data', () => {
//             // Arrange
//             const ExtraProductDetailsUtils = require('utils/ExtraProductDetailsUtils').default;
//             spyOn(ExtraProductDetailsUtils, 'availabilityLabel').and.returnValue('inStock');
//             const event = {};
//             const productId = sku.productId;
//             const name = sku.productName;
//             const args = {
//                 pageName: replaceSpecialCharacters(`add to basket for pickup modal:${productId}:n/a:*pname=${name}`),
//                 linkData: 'add to basket modal:view basket button'
//             };
//             wrapper.setProps({ preferredStoreName: 'Test store' });
//             const buttonWrapper = wrapper.find('SubtotalWithActionButtons').at(0).shallow().find('Button[data-at="atb_checkout"]');

//             // Act
//             buttonWrapper.simulate('click', event);

//             // Assert
//             expect(setNextPageDataStub).toHaveBeenCalledWith(args);
//         });

//         it('Checkout button should call setNextPageData with proper data', () => {
//             const event = {};
//             const productId = sku.productId;
//             const name = sku.productName;
//             const args = {
//                 pageName: replaceSpecialCharacters(`add to basket modal:${productId}:n/a:*pname=${name}`),
//                 linkData: 'add to basket modal:view basket button'
//             };
//             const buttonWrapper = wrapper.find('SubtotalWithActionButtons').at(0).shallow().find('Button[data-at="atb_checkout"]');

//             // Act
//             buttonWrapper.simulate('click', event);

//             // Assert
//             expect(setNextPageDataStub).toHaveBeenCalledWith(args);
//         });
//     });

//     describe('Test data-at attribues', () => {
//         it('should render data-at attribute set to "atb_modal"', () => {
//             const dataAt = wrapper.findWhere(n => n.name() === 'Modal' && n.prop('dataAt') === 'atb_modal');
//             expect(dataAt.length).toEqual(1);
//         });

//         it('should render data-at attribute set to "atbmodal_brand"', () => {
//             const dataAt = wrapper.findWhere(n => n.name() === 'div' && n.prop('data-at') === 'atbmodal_brand');
//             expect(dataAt.length).toEqual(1);
//         });

//         it('should render data-at attribute set to "atbmodal_name"', () => {
//             const dataAt = wrapper.findWhere(n => n.name() === 'div' && n.prop('data-at') === 'atbmodal_name');
//             expect(dataAt.length).toEqual(1);
//         });

//         it('should render data-at attribute set to "atb_product_info"', () => {
//             const dataAt = wrapper.findWhere(n => n.name() === 'Box' && n.prop('data-at') === 'atb_product_info');
//             expect(dataAt.length).toEqual(1);
//         });

//         it('should render data-at attribute set to "atb_basket_total"', () => {
//             wrapper.setProps({ preferredStoreName: false });
//             const dataAt = wrapper
//                 .find('SubtotalWithActionButtons')
//                 .at(0)
//                 .dive()
//                 .find('BasketSubtotalInfo')
//                 .at(0)
//                 .dive()
//                 .find('[data-at="atb_basket_total"]');
//             expect(dataAt.length).toEqual(1);
//         });

//         it('should render data-at attribute set to "atb_checkout"', () => {
//             wrapper.setProps({ preferredStoreName: false });
//             const dataAt = wrapper
//                 .find('SubtotalWithActionButtons')
//                 .at(0)
//                 .dive()
//                 .findWhere(n => n.name() === 'Button' && n.prop('data-at') === 'atb_checkout');
//             expect(dataAt.length).toEqual(1);
//         });

//         it('should render data-at attribute set to "add_to_basket_modal_message"', () => {
//             wrapper.setProps({ preferredStoreName: false });
//             const dataAt = wrapper.findWhere(n => n.name() === 'p' && n.prop('data-at') === 'add_to_basket_modal_message');
//             expect(dataAt.length).toEqual(1);
//         });
//     });
// });
