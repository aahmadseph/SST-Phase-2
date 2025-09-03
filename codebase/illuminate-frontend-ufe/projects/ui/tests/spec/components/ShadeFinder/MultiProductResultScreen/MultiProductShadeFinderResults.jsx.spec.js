// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');
// const actions = require('Actions').default;
// const MultiProductShadeFinderResults =
//     require('components/ShadeFinder/ResultsScreen/MultiProductShadeFinderResults/MultiProductShadeFinderResults').default;
// const reverseLookUpApi = require('services/api/sdn').default;
// const shadeCode = {
//     l: 82.26,
//     a: 10.64,
//     b: 17.44
// };

// const response = {
//     products: [
//         {
//             brandName: 'PAT McGRATH LABS',
//             displayName: 'Sublime Perfection Foundation',
//             variationType: 'Color',
//             variationValue: 'Deep 31',
//             variationDesc: 'deep with neutral undertones',
//             heroImage: 'https://qa4.sephora.com/productimages/sku/s2257178-main-zoom.jpg?imwidth=270',
//             image135: 'https://qa4.sephora.com/productimages/sku/s2257178-main-zoom.jpg?imwidth=135',
//             image450: 'https://qa4.sephora.com/productimages/sku/s2257178-main-zoom.jpg?imwidth=450',
//             productId: 'P447519',
//             rating: 3.9,
//             reviews: 10,
//             targetUrl: '/product/skin-fetish-sublime-perfection-foundation-P447519?skuId=2257178',
//             currentSku: {
//                 imageAltText: 'PAT McGRATH LABS-Sublime Perfection Foundation',
//                 isAppExclusive: true,
//                 isBI: true,
//                 isFirstAccess: false,
//                 isLimitedEdition: false,
//                 isLimitedTimeOffer: false,
//                 isNew: true,
//                 isOnlineOnly: false,
//                 isSephoraExclusive: true,
//                 listPrice: '$68.00',
//                 skuId: '2257178',
//                 skuType: 'Standard'
//             }
//         },
//         {
//             brandName: 'KVD Beauty',
//             displayName: 'Good Apple Skin-Perfecting Hydrating Foundation Balm',
//             variationType: 'Color',
//             variationValue: 'Tan 076',
//             variationDesc: 'for tan to deep skin with neutral undertones',
//             heroImage: 'https://qa4.sephora.com/productimages/sku/s2420271-main-zoom.jpg?imwidth=270',
//             image135: 'https://qa4.sephora.com/productimages/sku/s2420271-main-zoom.jpg?imwidth=135',
//             image450: 'https://qa4.sephora.com/productimages/sku/s2420271-main-zoom.jpg?imwidth=450',
//             productId: 'P469488',
//             rating: 0,
//             reviews: 0,
//             targetUrl: '/product/kvd-vegan-beauty-good-apple-skin-perfecting-foundation-balm-P469488?skuId=2420271',
//             currentSku: {
//                 imageAltText: 'KVD Beauty-Good Apple Skin-Perfecting Hydrating Foundation Balm',
//                 isAppExclusive: false,
//                 isBI: false,
//                 isFirstAccess: false,
//                 isLimitedEdition: false,
//                 isLimitedTimeOffer: false,
//                 isNew: false,
//                 isOnlineOnly: false,
//                 isSephoraExclusive: false,
//                 listPrice: '$38.00',
//                 skuId: '2420271',
//                 skuType: 'Standard'
//             }
//         }
//     ]
// };

// const getMultiProductMatch = () => {
//     return {
//         then: callback => {
//             callback(response);

//             return {
//                 then: () => {},
//                 catch: () => {}
//             };
//         },
//         catch: reject => {
//             return reject();
//         }
//     };
// };

// const getMultiProductMatchAPIError = () => {
//     return {
//         then: callback => {
//             callback({
//                 error: 'Internal Server Error',
//                 message: '',
//                 path: '/product-catalog-service/v1/reverseLookUp/shadefinder/skus/lab',
//                 status: 500
//             });

//             return {
//                 then: () => {},
//                 catch: e => {
//                     return e({ serverError: true });
//                 }
//             };
//         },
//         catch: reject => {
//             return reject();
//         }
//     };
// };

// const getMultiProductMatchServerError = () => {
//     return {
//         then: callback => {
//             callback({ serverError: true });

//             return {
//                 then: () => {},
//                 catch: () => {}
//             };
//         },
//         catch: reject => {
//             return reject();
//         }
//     };
// };

// const localization = {
//     products: 'products',
//     serverErrorMessage: 'Uh oh, something went wrong.',
//     serverErrorAction: 'Click above to find your shade again.',
//     apiErrorMessage: 'Looks like we couldn’t find any results…',
//     apiErrorAction: 'Please click above to find your shade again.',
//     queryParamsErrorMessage: 'Welcome to Shade Finder',
//     queryParamsErrorAction: 'Click above to find your matching foundation.'
// };

// const showInfoModal = () => {};

// describe('ResultsScreen', () => {
//     describe('render results', () => {
//         let mountedcomponent;
//         let productGrid;
//         let loading;

//         beforeEach(() => {
//             spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue(shadeCode);
//             // spyOn(reverseLookUpApi, 'getMultiMatch').and.returnValue(response);
//             loading = spyOn(actions, 'showInterstice');

//             mountedcomponent = shallow(
//                 <MultiProductShadeFinderResults
//                     showInterstice={actions.showInterstice}
//                     getMultiProductMatch={getMultiProductMatch}
//                     localization={localization}
//                     showInfoModal={showInfoModal}
//                 />
//             );
//             productGrid = mountedcomponent.find('ProductGrid').get(0);
//         });

//         it('should render Interstice', () => {
//             expect(loading.calls.first().args[0]).toBe(true);
//         });

//         it('Should hide Interstice', () => {
//             expect(loading.calls.mostRecent().args[0]).toBe(false);
//         });

//         it('should render ProductGrid', () => {
//             expect(productGrid).toBeDefined();
//         });

//         it('should render total products', () => {
//             expect(mountedcomponent.props().children[1].props.children).toBe('2 products');
//         });

//         it('should render products', () => {
//             expect(productGrid.props.products.length).toBe(response.products.length);
//         });
//     });

//     describe('render errors', () => {
//         describe('Parameter Error', () => {
//             let mountedcomponent;
//             let errorMessageHolder;

//             beforeEach(() => {
//                 spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({});
//                 mountedcomponent = shallow(
//                     <MultiProductShadeFinderResults
//                         showInterstice={actions.showInterstice}
//                         getMultiProductMatch={getMultiProductMatch}
//                         localization={localization}
//                         showInfoModal={showInfoModal}
//                     />
//                 );
//                 errorMessageHolder = mountedcomponent.find('div').at(0).prop('children');
//             });

//             it('should render Parameter Error message', () => {
//                 expect(errorMessageHolder[0].props.children).toBe('Welcome to Shade Finder');
//             });

//             it('should render Parameter Error action', () => {
//                 expect(errorMessageHolder[1].props.children).toBe('Click above to find your matching foundation.');
//             });
//         });

//         describe('API request error', () => {
//             let mountedcomponent;
//             let errorMessageHolder;

//             beforeEach(() => {
//                 spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue(shadeCode);

//                 mountedcomponent = shallow(
//                     <MultiProductShadeFinderResults
//                         showInterstice={actions.showInterstice}
//                         getMultiProductMatch={getMultiProductMatchAPIError}
//                         localization={localization}
//                         showInfoModal={showInfoModal}
//                     />
//                 );
//                 errorMessageHolder = mountedcomponent.find('div').at(0).prop('children');
//             });

//             it('should render API Error message', () => {
//                 expect(errorMessageHolder[0].props.children).toBe('Looks like we couldn’t find any results…');
//             });

//             it('should render API Error message action', () => {
//                 expect(errorMessageHolder[1].props.children).toBe('Please click above to find your shade again.');
//             });
//         });

//         describe('Server request error', () => {
//             let mountedcomponent;
//             let errorMessageHolder;

//             beforeEach(() => {
//                 spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue(shadeCode);

//                 mountedcomponent = shallow(
//                     <MultiProductShadeFinderResults
//                         showInterstice={actions.showInterstice}
//                         getMultiProductMatch={getMultiProductMatchServerError}
//                         localization={localization}
//                         showInfoModal={showInfoModal}
//                     />
//                 );
//                 errorMessageHolder = mountedcomponent.find('div').at(0).prop('children');
//             });

//             it('should render API Error message', () => {
//                 expect(errorMessageHolder[0].props.children).toBe('Uh oh, something went wrong.');
//             });

//             it('should render API Error message action', () => {
//                 expect(errorMessageHolder[1].props.children).toBe('Click above to find your shade again.');
//             });
//         });
//     });
// });
