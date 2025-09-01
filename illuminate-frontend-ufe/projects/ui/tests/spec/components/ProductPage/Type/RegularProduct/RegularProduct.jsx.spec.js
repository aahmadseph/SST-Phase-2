// const { shallow } = require('enzyme');
// const React = require('react');

// describe('RegularProduct component', () => {
//     let RegularProduct;
//     let skuUtils;
//     let store;

//     beforeEach(() => {
//         RegularProduct = require('components/ProductPage/Type/RegularProduct/RegularProduct').default;
//         skuUtils = require('utils/Sku').default;
//         store = require('Store').default;
//         const Events = require('utils/framework/Events').default;

//         spyOn(Events, 'onLastLoadEvent').and.callFake(() => {});
//     });

//     describe('top content', () => {
//         let state;
//         beforeEach(() => {
//             state = {
//                 currentProduct: {
//                     currentSku: {},
//                     focusedSku: {},
//                     productDetails: {
//                         brand: 'Fenty',
//                         displayName: 'Fenty By Rihana',
//                         rating: '4',
//                         lovesCount: '10'
//                     },
//                     combinedMiddleProductBanner: [],
//                     combinedProductBanner: []
//                 },
//                 isSkuReady: true
//             };
//         });

//         it('should render top content', () => {
//             // Arrange
//             spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//             let wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });

//             // Act
//             wrapper = wrapper.setState(state);

//             // Assert
//             const LayoutTop = wrapper.find('LayoutTop');
//             expect(LayoutTop.exists()).toBeTruthy();
//         });
//     });

//     describe('render the below the fold component', () => {
//         let state;
//         beforeEach(() => {
//             state = { currentProduct: { currentSku: {} } };
//         });

//         it('should render Highlights Section', () => {
//             // Arrange
//             const storeData = {
//                 page: { product: { currentSku: { skuId: '1' } } },
//                 user: { preferredStoreInfo: { storeId: '111' } }
//             };
//             spyOn(store, 'getState').and.returnValue(storeData);
//             spyOn(skuUtils, 'isGiftCard');
//             const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });

//             // Act
//             wrapper.instance().isSkuReady = true;
//             wrapper.setState(state);

//             // Assert
//             const Highlights = wrapper.find('Highlights');
//             expect(Highlights.length).toEqual(1);
//         });

//         it('should disply info with about this product title', () => {
//             // Arrange
//             const storeData = {
//                 page: { product: { currentSku: { skuId: '1' } } },
//                 user: { preferredStoreInfo: { storeId: '111' } }
//             };
//             spyOn(store, 'getState').and.returnValue(storeData);
//             spyOn(skuUtils, 'isGiftCard');
//             const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });

//             // Act
//             wrapper.instance().isSkuReady = true;
//             wrapper.setState(state);

//             // Assert
//             const Info = wrapper.find('ConnectedInfo');
//             expect(Info.prop('title')).toBe('About the Product');
//         });

//         it('should render Ingredients Section', () => {
//             // Arrange
//             const storeData = {
//                 page: { product: { currentSku: { skuId: '1' } } },
//                 user: { preferredStoreInfo: { storeId: '111' } }
//             };
//             spyOn(store, 'getState').and.returnValue(storeData);
//             spyOn(skuUtils, 'isGiftCard');
//             const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });

//             // Act
//             wrapper.instance().isSkuReady = true;
//             wrapper.setState(state);

//             // Assert
//             const Ingredients = wrapper.find('Ingredients');
//             expect(Ingredients.length).toEqual(1);
//         });

//         it('should display product carosuel with Use It With', () => {
//             // Arrange
//             const storeData = {
//                 page: { product: { currentSku: { skuId: '1' } } },
//                 user: { preferredStoreInfo: { storeId: '111' } }
//             };
//             spyOn(store, 'getState').and.returnValue(storeData);
//             spyOn(skuUtils, 'isGiftCard');
//             const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });

//             // Act
//             wrapper.instance().isSkuReady = true;
//             wrapper.setState(state);

//             // Assert
//             const ProductCardCarousel = wrapper.find('ProductCardCarousel').at(0);
//             expect(ProductCardCarousel.prop('title')).toBe('Use It With');
//         });

//         it('should have an anchor for QandA section', () => {
//             // Arrange
//             const storeData = {
//                 page: { product: { currentSku: { skuId: '1' } } },
//                 user: { preferredStoreInfo: { storeId: '111' } }
//             };
//             spyOn(store, 'getState').and.returnValue(storeData);
//             spyOn(skuUtils, 'isGiftCard');
//             const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });

//             // Act
//             wrapper.instance().isSkuReady = true;
//             wrapper.setState(state);

//             // Assert
//             const QA = wrapper.find('#QandA');
//             expect(QA.exists()).toBeTruthy();
//         });

//         it('should have an anchor for rating and review section', () => {
//             // Arrange
//             const storeData = {
//                 page: { product: { currentSku: { skuId: '1' } } },
//                 user: { preferredStoreInfo: { storeId: '111' } }
//             };
//             spyOn(store, 'getState').and.returnValue(storeData);
//             spyOn(skuUtils, 'isGiftCard');
//             const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });

//             // Act
//             wrapper.instance().isSkuReady = true;
//             wrapper.setState(state);

//             // Assert
//             const RRContainer = wrapper.find('#ratings-reviews-container');
//             expect(RRContainer.exists()).toBeTruthy();
//         });
//     });

//     describe('handleResize', () => {
//         it('should change isSmallView state to false if it is not a small view', () => {
//             // Arrange
//             spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//             const component = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//             component.setState({ isSmallView: false });
//             const instance = component.instance();
//             spyOn(window, 'matchMedia').and.callFake(() => ({ matches: false }));
//             // Act
//             instance.handleResize();
//             // Assert
//             expect(instance.state.isSmallView).toBe(false);
//         });

//         it('should change isSmallView state to false if it is a small view', () => {
//             // Arrange
//             spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//             const component = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//             component.setState({ isSmallView: true });
//             const instance = component.instance();
//             spyOn(window, 'matchMedia').and.callFake(() => ({ matches: true }));
//             // Act
//             instance.handleResize();
//             // Assert
//             expect(instance.state.isSmallView).toBe(true);
//         });
//     });

//     describe('getItShippedClick', () => {
//         it('should set getItShipped state on true when getItShippedClick called', () => {
//             // Arrange
//             spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//             const component = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//             const instance = component.instance();
//             // Act
//             instance.getItShippedClick();
//             // Assert
//             expect(instance.state.getItShipped).toBe(true);
//         });
//     });

//     describe('componentDidUpdate', () => {
//         it('should invoke calculatePreventPageRenderReportFlag function', () => {
//             // Arrange
//             spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//             const state = {
//                 currentProduct: {
//                     currentSku: { skuId: '1' },
//                     productDetails: { productId: '1' }
//                 },
//                 isSkuReady: true,
//                 reserveAndPickup: true,
//                 getItShipped: false
//             };

//             const props = {
//                 updateRequestData: () => {}
//             };

//             const wrapper = shallow(<RegularProduct {...props} />, { disableLifecycleMethods: true });
//             const component = wrapper.instance();
//             component.calculatePreventPageRenderReportFlag = () => {};
//             const calculatePreventPageRenderReportFlag = spyOn(component, 'calculatePreventPageRenderReportFlag');

//             // Act
//             component.componentDidUpdate(null, state);

//             // Assert
//             expect(calculatePreventPageRenderReportFlag).toHaveBeenCalledTimes(1);
//         });

//         it('should reset get it shipped, same day, and ropis states when navigating to different SPA ppage', () => {
//             // Arrange
//             spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//             const state = {
//                 currentProduct: {
//                     currentSku: {
//                         skuId: '1',
//                         actionFlags: { availabilityStatus: 'In Stock' },
//                         replenishmentFreqNum: 1,
//                         replenishmentFreqType: 'weeks'
//                     },
//                     productDetails: { productId: '1' }
//                 },
//                 isSkuReady: true,
//                 reserveAndPickup: true,
//                 getItShipped: false,
//                 trackedStoreId: ''
//             };
//             const newState = {
//                 currentProduct: {
//                     productDetails: { productId: '2' },
//                     currentSku: {
//                         skuId: '2',
//                         actionFlags: { availabilityStatus: 'In Stock' },
//                         replenishmentFreqNum: 1,
//                         replenishmentFreqType: 'weeks'
//                     }
//                 }
//             };
//             const expectedState = {
//                 replenishmentFreqNum: 1,
//                 replenishmentFreqType: 'weeks',
//                 isAutoReplenMostCommon: false,
//                 quantity: 1,
//                 autoReplenishChecked: false
//             };

//             const props = {
//                 updateRequestData: () => {}
//             };
//             const wrapper = shallow(<RegularProduct {...props} />, { disableLifecycleMethods: true });
//             const component = wrapper.instance();
//             wrapper.setState(state);

//             component.calculatePreventPageRenderReportFlag = () => {};
//             wrapper.setState({ ...newState });
//             const setState = spyOn(component, 'setState');

//             // Act
//             component.componentDidUpdate(null, state);

//             // Assert
//             expect(setState).toHaveBeenCalledWith(expectedState);
//         });

//         describe('auto replenishment', () => {
//             let state;
//             beforeEach(() => {
//                 state = {
//                     currentProduct: {
//                         currentSku: {
//                             skuId: '1',
//                             replenishmentFreqNum: null,
//                             replenishmentFreqType: null
//                         },
//                         productDetails: { productId: '1' }
//                     }
//                 };
//             });

//             it('should update replenishmentFreqNum and replenishmentFreqType', () => {
//                 spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//                 const newState = {
//                     currentProduct: {
//                         currentSku: {
//                             skuId: '1',
//                             replenishmentFreqNum: 5,
//                             replenishmentFreqType: 'Weeks'
//                         }
//                     }
//                 };
//                 const expectedState = {
//                     replenishmentFreqNum: 5,
//                     replenishmentFreqType: 'Weeks',
//                     isAutoReplenMostCommon: false
//                 };
//                 const props = {
//                     updateRequestData: () => {}
//                 };
//                 const wrapper = shallow(<RegularProduct {...props} />, { disableLifecycleMethods: true });
//                 const component = wrapper.instance();
//                 wrapper.setState(state);
//                 wrapper.setState({ ...newState });
//                 const setState = spyOn(component, 'setState');

//                 // Act
//                 component.componentDidUpdate(null, state);

//                 // Assert
//                 expect(setState).toHaveBeenCalledWith(expectedState);
//             });

//             it('should load DeliveryFrequencyModal', () => {
//                 spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//                 const newState = {
//                     isFrequencyModalOpen: true,
//                     currentProduct: {
//                         currentSku: {
//                             skuId: '1',
//                             replenishmentFreqNum: 5,
//                             replenishmentFreqType: 'Weeks'
//                         }
//                     },
//                     replenishmentFreqNum: 5,
//                     replenishmentFreqType: 'Weeks'
//                 };
//                 const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//                 wrapper.setState(newState);
//                 const DeliveryFrequencyModal = wrapper.find('LayoutTop').shallow().find('ErrorBoundary(Connect(DeliveryFrequencyModal))');

//                 // Assert
//                 expect(DeliveryFrequencyModal.length).toBe(1);
//             });

//             it('should NOT load DeliveryFrequencyModal', () => {
//                 spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//                 const newState = {
//                     currentProduct: {
//                         currentSku: {
//                             skuId: '1'
//                         }
//                     }
//                 };
//                 const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//                 wrapper.setState(newState);
//                 const DeliveryFrequencyModal = wrapper.find('LayoutTop').shallow().find('Connect(DeliveryFrequencyModal)');

//                 // Assert
//                 expect(DeliveryFrequencyModal.length).toBe(0);
//             });

//             it('should display "get it for... with Auto-Replenish" if currentSku.isReplenishmentEligible is true', () => {
//                 spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//                 const newState = {
//                     currentProduct: {
//                         currentSku: {
//                             skuId: '1',
//                             replenishmentFreqNum: 5,
//                             replenishmentFreqType: 'Weeks',
//                             isReplenishmentEligible: true,
//                             replenishmentAdjuster: '10.00',
//                             replenishmentAdjusterPrice: '$11.70',
//                             replenishmentAdjusterType: 'P'
//                         }
//                     },
//                     replenishmentFreqNum: 5,
//                     replenishmentFreqType: 'Weeks'
//                 };
//                 Sephora.configurationSettings.isAutoReplenishmentEnabled = true;
//                 const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//                 wrapper.setState(newState);
//                 const FlexComponents = wrapper.find('LayoutTop').shallow().find('Price');

//                 const getItForMessage = FlexComponents.shallow().findWhere(n => n.name() === 'Text' && n.contains('get it for'));
//                 // Assert
//                 expect(getItForMessage.length).toBe(1);
//             });

//             it('should NOt display "get it for... with Auto-Replenish" if currentSku.isReplenishmentEligible is false', () => {
//                 spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//                 const newState = {
//                     currentProduct: {
//                         currentSku: {
//                             skuId: '1',
//                             replenishmentFreqNum: 5,
//                             replenishmentFreqType: 'Weeks',
//                             isReplenishmentEligible: false
//                         }
//                     },
//                     replenishmentFreqNum: 5,
//                     replenishmentFreqType: 'Weeks'
//                 };
//                 const wrapper = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//                 wrapper.setState(newState);
//                 const FlexComponents = wrapper.find('LayoutTop').shallow().find('Flex');
//                 const getItForMessage = FlexComponents.findWhere(n => n.name() === 'Text' && n.contains('get it for'));
//                 // Assert
//                 expect(getItForMessage.length).toBe(0);
//             });
//         });
//     });

//     it('Quantity Picker in Add to Cart Button should pass `displayQuantityPickerInATB` prop as true to <CallToAction/>', () => {
//         spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
//         const Location = require('utils/Location').default;
//         const state = {
//             currentProduct: {
//                 currentSku: {},
//                 productDetails: {
//                     brand: 'Fenty',
//                     displayName: 'Fenty By Rihana',
//                     rating: '4',
//                     lovesCount: '10'
//                 }
//             },
//             isSkuReady: true
//         };
//         spyOn(Location, 'isProductPage').and.returnValue(true);
//         state.displayPpageOptimization = true;
//         state.displayQuantityPickerInATB = true;

//         const shallowComponent = shallow(<RegularProduct />, { disableLifecycleMethods: true });
//         shallowComponent.instance().isSkuReady = true;
//         shallowComponent.setState(state);

//         const layoutTopWrapper = shallowComponent.find('LayoutTop').shallow();
//         const callToActionWrapper = layoutTopWrapper.find('CallToAction');
//         expect(callToActionWrapper.props().displayQuantityPickerInATB).toBe(true);
//     });
// });
