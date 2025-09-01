// const React = require('react');
// const shallow = enzyme.shallow;

// describe('ResultsScreen', () => {
//     let ResultsScreen;
//     let store;
//     let reverseLookUpApi;
//     let processEvent;
//     let component;
//     let props;
//     let wizardObject;
//     let wrapper;
//     let getReverseLookUpMatchStub;
//     let getReverseLookUpSkuDetailsStub;

//     const skuData = {
//         skuName: 100,
//         variationDesc: 'sku description',
//         primaryProduct: {
//             brand: { displayName: 'brandName' },
//             displayName: 'dis'
//         },
//         smallImage: '/productimages/sku/s1548700-main-grid.jpg'

//     };

//     beforeEach(() => {
//         ResultsScreen = require('components/ShadeFinder/ResultsScreen/ResultsScreen');
//         store = require('store/Store').default;
//         reverseLookUpApi = require('services/api/sdn').default;
//         processEvent = require('analytics/processEvent').default;

//         wizardObject = {
//             wizard: {
//                 dataArray: [{ shadeCodeModel: 'shadeCode123' }],
//                 componentIndex: 0,
//                 brandName: 'antonym',
//                 skuId: '1977461'
//             }
//         };
//     });
//     describe('Shade Finder', () => {

//         describe('Exact Match modal', () => {
//             let exactMatchBody;

//             beforeEach(() => {
//                 props = {
//                     currentProduct: {
//                         productDetails: { productId: 'p123' },
//                         displayName: 'display name',
//                         brand: { displayName: 'brandDisplayName' }
//                     },
//                     matchFound: true,
//                     isMultiShadeFinder: false
//                 };

//                 const responseWithMatch = {
//                     then: function (callback) {
//                         callback({
//                             shadeCode: '123',
//                             match: 'exact match',
//                             skuId: '456'
//                         });
//                     }
//                 };

//                 spyOn(store, 'getState').and.returnValue(wizardObject);
//                 getReverseLookUpMatchStub = spyOn(reverseLookUpApi, 'getProductIdLab');
//                 getReverseLookUpSkuDetailsStub =
//                     spyOn(reverseLookUpApi, 'getReverseLookUpSkuDetails');

//                 getReverseLookUpMatchStub.and.returnValue(responseWithMatch);

//                 getReverseLookUpSkuDetailsStub.and.returnValue(
//                     {
//                         then: function (callback) {
//                             callback(skuData);
//                             return new Promise((resolve) => resolve());
//                         }
//                     }
//                 );
//                 wrapper = shallow(<ResultsScreen {...props} />);
//                 component = wrapper.instance();
//                 exactMatchBody = wrapper.children();
//             });

//             it('Should render brand name', () => {
//                 expect(exactMatchBody.at(2).children().at(0).props().children[0]).toEqual('We found your exact match');
//             });

//             it('Should render sku image in circle', () => {
//                 expect(exactMatchBody.at(2).children().at(2).props().borderRadius).toBe(9999);
//             });

//             it('Should render color description', () => {
//                 expect(exactMatchBody.at(2).children().at(3).props().children[2]).toBe('100 - sku description');
//             });
//         });

//         describe('No Match modal', () => {
//             let noMatchBody;

//             beforeEach(() => {
//                 props = {
//                     currentProduct: {
//                         productDetails: {
//                             productId: 'p123',
//                             brand: { displayName: 'display name' },
//                             displayName: 'brandDisplayName'
//                         },
//                         displayName: 'display name',
//                         brand: { displayName: 'brandDisplayName' }
//                     },
//                     matchFound: false,
//                     isMultiShadeFinder: false
//                 };

//                 const responseWithMatch = {
//                     then: function (callback) {
//                         callback({
//                             shadeCode: '123',
//                             match: 'no match',
//                             skuId: '456'
//                         });
//                     }
//                 };

//                 spyOn(store, 'getState').and.returnValue(wizardObject);
//                 getReverseLookUpMatchStub = spyOn(reverseLookUpApi, 'getProductIdLab');
//                 getReverseLookUpSkuDetailsStub =
//                     spyOn(reverseLookUpApi, 'getReverseLookUpSkuDetails');

//                 getReverseLookUpMatchStub.and.returnValue(responseWithMatch);

//                 getReverseLookUpSkuDetailsStub.and.returnValue(
//                     {
//                         then: function (callback) {
//                             callback(skuData);
//                             return new Promise((resolve) => resolve());
//                         }
//                     }
//                 );
//                 wrapper = shallow(<ResultsScreen {...props} />);
//                 component = wrapper.instance();
//                 noMatchBody = wrapper.children();
//             });

//             it('should render no match modal', () => {
//                 expect(noMatchBody.at(2).children().at(0).props().children).toBe('Sorry, we weren’t able to find a match for you.');

//             });
//         });

//         describe('No Match modal /catalog/skus/SKU_ID error', () => {
//             let noMatchBody;

//             beforeEach(() => {
//                 props = {
//                     currentProduct: {
//                         productDetails: {
//                             productId: 'p123',
//                             brand: { displayName: 'display name' },
//                             displayName: 'brandDisplayName'
//                         },
//                         displayName: 'display name',
//                         brand: { displayName: 'brandDisplayName' }
//                     },
//                     matchFound: true
//                 };

//                 const responseWithMatch = {
//                     then: function (callback) {
//                         callback({
//                             shadeCode: '123',
//                             match: 'closest match',
//                             skuId: '456'
//                         });
//                     }
//                 };

//                 spyOn(store, 'getState').and.returnValue(wizardObject);
//                 getReverseLookUpMatchStub = spyOn(reverseLookUpApi, 'getProductIdLab');
//                 getReverseLookUpSkuDetailsStub =
//                     spyOn(reverseLookUpApi, 'getReverseLookUpSkuDetails');

//                 getReverseLookUpMatchStub.and.returnValue(responseWithMatch);

//                 const fakePromise = {
//                     then: () => fakePromise,
//                     catch: reject => {
//                         reject(
//                             {
//                                 errorCode: '-14',
//                                 errorMessage: ['Sku is out of stock'],
//                                 errors: { invalidInput: ['Sku is out of stock'] }
//                             }
//                         );
//                     }
//                 };
//                 getReverseLookUpSkuDetailsStub.and.returnValue(fakePromise);
//                 wrapper = shallow(<ResultsScreen {...props} />);
//                 component = wrapper.instance();
//                 noMatchBody = wrapper.children();
//             });

//             it('should render no match modal', () => {
//                 expect(noMatchBody.at(2).children().at(0).props().children).toBe('Sorry, we weren’t able to find a match for you.');

//             });
//         });

//         describe('Landing on page should fire analytics process event', () => {
//             const analyticsConstants = require('analytics/constants').default;
//             const contextEventStub = { pageName: 'product:shade finder-landing page:n/a:*' };
//             let processStub;
//             let world;
//             let brand;
//             let skuId;
//             let shadeFinder;
//             let matchType;
//             let anaUtils;
//             let UrlUtils;
//             let setNextPageDataStub;

//             beforeEach(() => {
//                 UrlUtils = require('utils/Url').default;
//                 anaUtils = require('analytics/utils').default;
//                 props = {
//                     currentProduct: {
//                         displayName: 'display name',
//                         brand: { displayName: 'brandDisplayName' }
//                     },
//                     isMultiShadeFinder: true
//                 };

//                 spyOn(store, 'getState').and.returnValue(wizardObject);
//                 spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue(contextEventStub);
//                 processStub = spyOn(processEvent, 'process');
//                 // Without `redirectStub`
//                 // 'Some of your tests did a full page reload!'
//                 // error occurs
//                 // eslint-disable-next-line no-undef
//                 redirectStub = spyOn(UrlUtils, 'redirectTo');
//                 setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
//                 wrapper = shallow(<ResultsScreen {...props} />);
//                 component = wrapper.instance();
//                 spyOn(component, 'processAnalytics');
//                 component.componentDidMount();

//                 brand = 'antonym';
//                 skuId = '1977461';
//                 world = window.digitalData.page.attributes.world || 'n/a';
//             });

//             it('If isMultiShadeFinder should trigger processAnalytics with proper data', () => {
//                 expect(component.processAnalytics).toHaveBeenCalledWith(
//                     'match found',
//                     brand,
//                     skuId,
//                     world
//                 );

//             });

//             it('processAnalytics should trigger ASYNC_PAGE_LOAD event with certain data', () => {
//                 shadeFinder = 'shade finder';
//                 matchType = 'match found';

//                 expect(processStub).toHaveBeenCalledWith(
//                     analyticsConstants.ASYNC_PAGE_LOAD, {
//                         data: {
//                             world,
//                             pageType: 'product',
//                             pageDetail: `${shadeFinder}-${matchType}`,
//                             pageName: `product:shade finder-match found:${world}:*`,
//                             internalCampaign: `product:shade finder:lookup brand-${brand}:matchedsku-${skuId}`,
//                             previousPageName: `product:shade finder-landing page:${world}:*`
//                         }
//                     }
//                 );
//             });

//             it('Send data when redirecting to Analytics', () => {
//                 const onClick = wrapper.findWhere((n) => n.key() === 'viewProducts').at(0).prop('onClick');

//                 onClick();
//                 expect(setNextPageDataStub).toHaveBeenCalledWith({
//                     world: 'n/a',
//                     linkData: 'shade finder:view products',
//                     pageName: 'product:shade finder-match found:n/a:*',
//                     previousPageName: 'shade finder-results'
//                 });
//             });
//         });
//     });

//     describe('Multi Shade Finder', () => {
//         let exactMatchBody;

//         beforeEach(() => {
//             props = {
//                 matchFound: true,
//                 isMultiShadeFinder: true
//             };

//             const responseWithMatch = {
//                 then: function (callback) {
//                     callback({
//                         shadeCode: '123',
//                         // match: 'exact match',
//                         skuId: '456'
//                     });
//                 }
//             };

//             spyOn(store, 'getState').and.returnValue(wizardObject);
//             getReverseLookUpMatchStub = spyOn(reverseLookUpApi, 'getProductIdLab');
//             getReverseLookUpSkuDetailsStub =
//                 spyOn(reverseLookUpApi, 'getReverseLookUpSkuDetails');

//             getReverseLookUpMatchStub.and.returnValue(responseWithMatch);

//             getReverseLookUpSkuDetailsStub.and.returnValue(
//                 {
//                     then: function (callback) {
//                         callback(skuData);
//                         return new Promise((resolve) => resolve());
//                     }
//                 }
//             );
//             wrapper = shallow(<ResultsScreen {...props} />);
//             component = wrapper.instance();
//             exactMatchBody = wrapper.children();
//         });

//         it('Should render Multi Shade Finder match title ', () => {
//             const matchTitle = exactMatchBody.at(2).children().at(0).props().children;
//             expect(matchTitle[0]).toEqual('We found your shade');
//         });

//         it('Should render See all products button', () => {
//             expect(exactMatchBody.find('Button').at(0).props().children).toBe('See all products in this shade');
//         });

//     });

// });
