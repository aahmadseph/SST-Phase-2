// const React = require('react');
// const { shallow } = require('enzyme');

// describe('CallToActions', () => {
//     let CallToActions;

//     beforeEach(() => {
//         CallToActions = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/CallToActions').default;
//     });

//     describe('openCustomSets method', () => {
//         let store;
//         let UI;
//         let productActions;
//         let historyLocationActions;

//         beforeEach(() => {
//             store = require('Store').default;
//             UI = require('utils/UI').default;
//             productActions = require('actions/ProductActions').default;
//             historyLocationActions = require('actions/framework/HistoryLocationActions').default;
//         });

//         it('should call dispatch method', () => {
//             // Arrange
//             spyOn(historyLocationActions, 'goTo');
//             const dispatch = spyOn(store, 'dispatch');

//             // Act
//             shallow(<CallToActions />)
//                 .instance()
//                 .openCustomSets();

//             // Assert
//             expect(dispatch).toHaveBeenCalledTimes(2);
//         });

//         it('should call scrollToTop method', () => {
//             // Arrange
//             spyOn(historyLocationActions, 'goTo');
//             const scrollToTopStub = spyOn(UI, 'scrollToTop');

//             // Act
//             shallow(<CallToActions />)
//                 .instance()
//                 .openCustomSets();

//             // Assert
//             expect(scrollToTopStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call toggleCustomSets method', () => {
//             // Arrange
//             spyOn(historyLocationActions, 'goTo');
//             const toggleCustomSetsStub = spyOn(productActions, 'toggleCustomSets');

//             // Act
//             shallow(<CallToActions />)
//                 .instance()
//                 .openCustomSets();

//             // Assert
//             expect(toggleCustomSetsStub).toHaveBeenCalledTimes(1);
//         });
//     });

//     describe('viewDetailsLinkTracking method', () => {
//         let anaUtils;

//         beforeEach(() => {
//             anaUtils = require('analytics/utils').default;
//         });

//         it('should redirect to PPage with setNextPageData filled', () => {
//             // Arrange
//             const setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
//             const productId = '123123';
//             const displayName = 'productName';
//             const pageType = 'quicklook';
//             const actionInfo = `${pageType}:123123:View Details`;
//             const pageName = `${pageType}:123123::*pname=productName`;

//             // Act
//             shallow(<CallToActions />)
//                 .instance()
//                 .viewDetailsLinkTracking(productId, displayName)();

//             // Assert
//             expect(setNextPageDataStub).toHaveBeenCalledWith({
//                 linkData: actionInfo,
//                 internalCampaign: actionInfo,
//                 pageName,
//                 pageType
//             });
//         });
//     });
// });
