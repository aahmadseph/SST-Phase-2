// const React = require('react');
// const { shallow } = require('enzyme');

// describe('<PurchaseHistoryList /> component', () => {
//     let localeUtils;
//     let PurchaseHistoryList;
//     let shallowedComponent;

//     beforeEach(() => {
//         localeUtils = require('utils/LanguageLocale').default;
//         PurchaseHistoryList = require('components/RichProfile/PurchaseHistoryList/PurchaseHistoryList').default;
//         shallowedComponent = shallow(<PurchaseHistoryList />);
//     });

//     it('should render main component', () => {
//         expect(shallowedComponent.find('main').length).toBe(1);
//     });

//     describe('Replen item carousel', () => {
//         it('should not display carousel if there is no challenger active', () => {
//             expect(shallowedComponent.find('LegacyCarousel').length).toBe(0);
//         });

//         it('should not display carousel if there is challenger active but has no items', () => {
//             shallowedComponent = shallow(<PurchaseHistoryList testTarget={{ replenCarouselPurchaseHistory: { show: true } }} />);
//             expect(shallowedComponent.find('LegacyCarousel').length).toBe(0);
//         });

//         it('should display carousel if there is challenger active and has items', () => {
//             shallowedComponent = shallow(<PurchaseHistoryList testTarget={{ replenCarouselPurchaseHistory: { show: true } }} />);
//             shallowedComponent.setState({
//                 sortedPurchases: [
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     }
//                 ]
//             });
//             expect(shallowedComponent.find('LegacyCarousel').length).toBe(1);
//         });

//         it('should not display carousel if there is challenger active and has items but it is mobile', () => {
//             spyOn(Sephora, 'isMobile').and.returnValue(true);
//             shallowedComponent = shallow(<PurchaseHistoryList testTarget={{ replenCarouselPurchaseHistory: { show: true } }} />);
//             shallowedComponent.setState({
//                 sortedPurchases: [
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     }
//                 ]
//             });
//             expect(shallowedComponent.find('LegacyCarousel').length).toBe(0);
//         });

//         it('should not display carousel if there is challenger active and has items but it is on FR', () => {
//             spyOn(localeUtils, 'isFRCanada').and.returnValue(true);
//             shallowedComponent = shallow(<PurchaseHistoryList testTarget={{ replenCarouselPurchaseHistory: { show: true } }} />);
//             shallowedComponent.setState({
//                 sortedPurchases: [
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     }
//                 ]
//             });
//             expect(shallowedComponent.find('LegacyCarousel').length).toBe(0);
//         });

//         it('should show arrows on carousel if there is more than nine elements', () => {
//             shallowedComponent = shallow(<PurchaseHistoryList testTarget={{ replenCarouselPurchaseHistory: { show: true } }} />);
//             shallowedComponent.setState({
//                 sortedPurchases: [
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     },
//                     {
//                         sku: {
//                             isOutOfStock: false,
//                             isActive: true,
//                             actionFlags: { isAddToBasket: true }
//                         }
//                     }
//                 ]
//             });

//             expect(shallowedComponent.find('LegacyCarousel').prop('showArrows')).toBeTruthy();
//         });
//     });
// });
