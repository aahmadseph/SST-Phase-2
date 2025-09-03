// const React = require('react');
// // eslint-disable-next-line no-undef
// const shallow = enzyme.shallow;

// describe('ResultsScreen', () => {
//     let ResultsScreen;
//     let store;
//     let reverseLookUpApi;
//     let anaConsts;
//     let anaUtils;
//     let processEvent;
//     let processStub;
//     let component;
//     let setStateStub;
//     let props;
//     let wizardObject;

//     beforeEach(() => {
//         ResultsScreen = require('components/ShadeFinder/ResultsScreen/ResultsScreen').default;
//         store = require('store/Store').default;
//         reverseLookUpApi = require('services/api/sdn').default;
//         anaConsts = require('analytics/constants').default;
//         anaUtils = require('analytics/utils').default;
//         processEvent = require('analytics/processEvent').default;
//         wizardObject = {
//             wizard: {
//                 dataArray: [{ shadeCodeModel: 'shadeCode123' }],
//                 componentIndex: 0
//             }
//         };

//         props = {
//             currentProduct: {
//                 productDetails: { productId: 'p123' },
//                 displayName: 'display name',
//                 brand: { displayName: 'brandDisplayName' }
//             }
//         };

//         spyOn(store, 'getState').and.returnValue(wizardObject);
//         processStub = spyOn(processEvent, 'process');

//         const wrapper = shallow(<ResultsScreen {...props} />);
//         component = wrapper.instance();

//         setStateStub = spyOn(component, 'setState');
//     });

//     describe('ctrlr', () => {
//         let getReverseLookUpMatchStub;
//         let getReverseLookUpSkuDetailsStub;
//         const brandName = 'someBrand';
//         const displayName = 'lipstick';
//         const NO_MATCH_FOUND = 'no match';
//         const skuData = {
//             skuName: 100,
//             variationDesc: 'sku description',
//             primaryProduct: {
//                 brand: { displayName: brandName },
//                 displayName
//             }
//         };

//         beforeEach(() => {
//             getReverseLookUpMatchStub = spyOn(reverseLookUpApi, 'getProductIdLab');
//             getReverseLookUpSkuDetailsStub = spyOn(reverseLookUpApi, 'getReverseLookUpSkuDetails');

//             getReverseLookUpSkuDetailsStub.and.returnValue({
//                 then: function (callback) {
//                     callback(skuData);

//                     return Promise.resolve();
//                 }
//             });
//         });

//         describe('getReversLookupMatch returns a match', () => {
//             const responseWithMatch = {
//                 then: function (callback) {
//                     callback({
//                         shadeCode: '123',
//                         match: 'exact match',
//                         skuId: '456'
//                     });
//                 }
//             };

//             beforeEach(() => {
//                 getReverseLookUpMatchStub.and.returnValue(responseWithMatch);
//                 component.componentDidMount();
//             });

//             it('calls getReversLookUpMatch if it has a product id and a shade code', () => {
//                 expect(getReverseLookUpMatchStub).toHaveBeenCalled();
//             });

//             it('calls getReversLookUpSkuDetails if it has a product id and a shade code', () => {
//                 expect(getReverseLookUpSkuDetailsStub).toHaveBeenCalled();
//             });

//             it('calls setState with appropriate args', done => {
//                 const mockArgs = {
//                     shadeCode: '100 - sku description',
//                     matchText: 'exact match',
//                     sku: {
//                         skuName: 100,
//                         variationDesc: 'sku description',
//                         primaryProduct: {
//                             brand: { displayName: 'someBrand' },
//                             displayName: 'lipstick'
//                         }
//                     },
//                     matchFound: true,
//                     brandName: 'someBrand',
//                     displayName: 'lipstick'
//                 };

//                 expect(setStateStub).toHaveBeenCalledWith(mockArgs);
//                 done();
//             });
//         });

//         describe('getReversLookupMatch does not return a match', () => {
//             const responseWithoutMatch = {
//                 then: function (callback) {
//                     callback({ match: NO_MATCH_FOUND });
//                 }
//             };

//             beforeEach(() => {
//                 getReverseLookUpMatchStub.and.returnValue(responseWithoutMatch);
//                 component.componentDidMount();
//             });
//         });
//     });

//     describe('processAnalytics', () => {
//         const campaignPrefix = 'product:shade finder:lookup brand-';
//         const campaignSuffix = ':matchedsku-';
//         const pageNamePrefix = 'product:shade finder-';
//         const matchType = 'exact match';
//         const brandName = 'someBrand';
//         const skuId = 's123';

//         beforeEach(() => {
//             digitalData.product = [{ attributes: { world: 'makeup' } }];
//         });

//         it('should call process with correct args', () => {
//             const expectedInternalCampaign = `${campaignPrefix}${brandName}${campaignSuffix}${skuId}`.toLowerCase();
//             const expectedPageName = `${pageNamePrefix}${matchType}:makeup:*`.toLowerCase();
//             spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({ pageName: 'previousPageName' });

//             component.processAnalytics(matchType, brandName, skuId);

//             expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
//                 data: {
//                     internalCampaign: expectedInternalCampaign,
//                     pageName: expectedPageName,
//                     world: 'makeup',
//                     pageType: 'product',
//                     previousPageName: 'previousPageName',
//                     pageDetail: 'shade finder-exact match'
//                 }
//             });
//         });
//     });
// });
