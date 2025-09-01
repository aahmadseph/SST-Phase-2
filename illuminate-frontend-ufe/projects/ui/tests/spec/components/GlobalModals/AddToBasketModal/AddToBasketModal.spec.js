// /* eslint-disable object-curly-newline */
// const React = require('react');
// const { shallow } = require('enzyme');
// const store = require('Store').default;
// // const actions = require('actions/Actions').default;
// // const processEvent = require('analytics/processEvent').default;
// // const analyticsConsts = require('analytics/constants').default;
// // const analyticsUtils = require('analytics/utils').default;
// const AddToBasketModal = require('components/GlobalModals/AddToBasketModal/AddToBasketModal').default;
// // const replaceSpecialCharacters = require('utils/replaceSpecialCharacters').default;
// const localeUtils = require('utils/LanguageLocale').default;

// describe('AddToBasketModal component', () => {
//     let component;
//     let setStateStub;
//     const props = {
//         product: {
//             productId: 'pid',
//             displayName: 'someName',
//             productDetails: {
//                 productId: 'pid'
//             }
//         },
//         sku: {
//             skuId: 'someId'
//         },
//         replenishmentSelected: false,
//         replenishmentFrequency: '',
//         isAutoReplenMostCommon: false,
//         analyticsContext: 'atb_context'
//     };
//     /*
//     describe('ctrlr', () => {
//         beforeEach(() => {
//             const wrapper = shallow(<AddToBasketModal {...props} />);
//             component = wrapper.instance();
//             fireATBPageLoadTrackingStub = spyOn(component, 'fireATBPageLoadTracking');
//             component.ctrlr();
//         });

//         it('should call fireATBPageLoadTracking stub', () => {
//             expect(fireATBPageLoadTrackingStub).toHaveBeenCalledTimes(1);
//         });
//     });

//     describe('fireATBPageLoadTracking method', () => {
//         describe('when there is a context', () => {
//             beforeEach(() => {
//                 processStub = spyOn(processEvent, 'process');
//                 spyOn(analyticsUtils, 'getLastAsyncPageLoadData').and.returnValue({
//                     pageName: 'atbPageName',
//                     previousPage: 'atbPreviousPage'
//                 });
//                 component = shallow(<AddToBasketModal {...props} />).instance();
//             });

//             it('should call process stub', () => {
//                 expect(processStub).toHaveBeenCalledTimes(1);
//             });

//             it('should call process stub with async page load & correct data', () => {
//                 const pageName = replaceSpecialCharacters('add to basket modal' + ':' + props.product.productId + ':' +
//                 'n/a' + ':*pname=' + props.product.displayName);
//                 expect(processStub).toHaveBeenCalledWith(analyticsConsts.ASYNC_PAGE_LOAD, {
//                     data: {
//                         pageDetail: props.product.productId,
//                         productStrings: ';' + props.sku.skuId + ';;;;eVar26=' + props.sku.skuId,
//                         previousPageName: 'atbPageName',
//                         pageType: 'add to basket modal',
//                         world: 'n/a',
//                         pageName
//                     }
//                 });
//             });
//         });

//         describe('when there is no context', () => {
//             beforeEach(() => {
//                 processStub = spyOn(processEvent, 'process');
//                 spyOn(analyticsUtils, 'getLastAsyncPageLoadData').and.returnValue({
//                     pageName: undefined,
//                     previousPage: undefined
//                 });
//                 digitalData.page.attributes.sephoraPageInfo.pageName = 'fallbackPageName';
//                 const wrapper = shallow(<AddToBasketModal {...props} />);
//                 component = wrapper.instance();
//             });

//             it('should call process stub with async page load & correct data', () => {
//                 let pageName = replaceSpecialCharacters('add to basket modal' + ':' + props.product.productId + ':' +
//                 'n/a' + ':*pname=' + props.product.displayName);
//                 expect(processStub).toHaveBeenCalledWith(analyticsConsts.ASYNC_PAGE_LOAD, {
//                     data: {
//                         pageDetail: props.product.productId,
//                         productStrings: ';' + props.sku.skuId + ';;;;eVar26=' + props.sku.skuId,
//                         previousPageName: 'fallbackPageName',
//                         pageType: 'add to basket modal',
//                         world: 'n/a',
//                         pageName
//                     }
//                 });
//             });
//         });
//     });

//     describe('requestClose method', () => {
//         beforeEach(() => {
//             dispatchStub = spyOn(store, 'dispatch');
//             showAddToBasketModalStub = spyOn(actions, 'showAddToBasketModal').and.returnValue('showAddToBasketModal');
//             component = shallow(<AddToBasketModal {...props} />).instance();
//             component.requestClose();
//         });

//         it('should dispatch an action to show modal', () => {
//             expect(dispatchStub).toHaveBeenCalled();
//         });

//         it('should show showAddToBasketModal', () => {
//             expect(dispatchStub).toHaveBeenCalledWith('showAddToBasketModal');
//         });

//         it('should call showAddToBaketModal Stub', () => {
//             expect(showAddToBasketModalStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call showAddToBaketModal Stub with arguments', () => {
//             expect(showAddToBasketModalStub).toHaveBeenCalledWith({ isOpen: false });
//         });

//         it('should raise event LINK_TRACKING_EVENT with data object that has all required fields', () => {
//             // Arrange
//             spyOn(analyticsUtils, 'getLastAsyncPageLoadData').and.callFake(() => ({
//                 pageName: 'pageName',
//                 previousPage: 'previousPage',
//                 pageType: 'pageType',
//                 pageDetail: 'pageDetail'
//             }));
//             const { LINK_TRACKING_EVENT } = analyticsConsts;
//             const processEventProcessSpy = spyOn(processEvent, 'process');
//             const wrapper = shallow(<AddToBasketModal {...props} />);

//             // Act
//             wrapper.instance().requestClose(true);

//             // Assert
//             expect(processEventProcessSpy).toHaveBeenCalledWith(LINK_TRACKING_EVENT, {
//                 data: {
//                     actionInfo: 'add to basket modal:continue shopping button',
//                     linkName: 'add to basket modal:continue shopping button',
//                     pageName: 'pageName',
//                     previousPage: 'previousPage',
//                     pageType: 'pageType',
//                     pageDetail: 'pageDetail'
//                 }
//             });
//         });
//     });

//     describe('setNextPageData method', () => {
//         beforeEach(() => {
//             setNextPageDataStub = spyOn(analyticsUtils, 'setNextPageData');
//             spyOn(analyticsUtils, 'getLastAsyncPageLoadData').and.returnValue({
//                 pageName: 'atbPageName',
//                 previousPage: 'atbPreviousPage'
//             });
//             component = shallow(<AddToBasketModal {...props} />).instance();
//         });

//         it('should call setNextPageDataStub stub', () => {
//             component.setNextPageData();
//             expect(setNextPageDataStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call setNextPageDataStub stub with arguments for checkout button', () => {
//             component.setNextPageData('checkout button');
//             expect(setNextPageDataStub).toHaveBeenCalledWith({
//                 pageName: 'atbPageName',
//                 linkData: 'add to basket modal:checkout button'
//             });
//         });

//         it('should call setNextPageDataStub stub with arguments for continue shopping button', () => {
//             component.setNextPageData('continue shopping button');
//             expect(setNextPageDataStub).toHaveBeenCalledWith({
//                 pageName: 'atbPageName',
//                 linkData: 'add to basket modal:continue shopping button'
//             });
//         });
//     });
//     */

//     describe('getModalItemMessages method', () => {
//         let itemsStub;
//         let wrapper;

//         beforeEach(() => {
//             wrapper = shallow(<AddToBasketModal {...props} />);
//             component = wrapper.instance();
//             setStateStub = spyOn(component, 'setState');
//         });

//         it('should return the messages of the proper item', () => {
//             itemsStub = [
//                 {
//                     sku: props.sku,
//                     itemLevelMessages: [{ messages: ['1', '2'] }]
//                 },
//                 {
//                     sku: {
//                         skuId: 'some another sku'
//                     },
//                     itemLevelMessages: [{ messages: ['4', '5'] }, { messages: ['6'] }]
//                 }
//             ];
//             component.getModalItemMessages(itemsStub);
//             expect(setStateStub).toHaveBeenCalledWith({
//                 itemLevelMessages: ['1', '2']
//             });
//         });

//         it('should concat the messages of the proper item if there\'re couple of arrays', () => {
//             itemsStub = [
//                 {
//                     sku: props.sku,
//                     itemLevelMessages: [{ messages: ['1', '2'] }, { messages: ['3'] }]
//                 },
//                 {
//                     sku: {
//                         skuId: 'some another sku'
//                     },
//                     itemLevelMessages: [{ messages: ['4', '5'] }, { messages: ['6'] }]
//                 }
//             ];
//             component.getModalItemMessages(itemsStub);
//             expect(setStateStub).toHaveBeenCalledWith({
//                 itemLevelMessages: ['1', '2', '3']
//             });
//         });

//         it('should not return any messages for skus not related to props', () => {
//             itemsStub = [
//                 {
//                     sku: {
//                         skuId: 'some another sku'
//                     },
//                     itemLevelMessages: [{ messages: ['4', '5'] }, { messages: ['6'] }]
//                 }
//             ];
//             component.getModalItemMessages(itemsStub);
//             expect(setStateStub).not.toHaveBeenCalled();
//         });

//         it('should contain SubtotalWithActionButtons', () => {
//             expect(wrapper.find('SubtotalWithActionButtons').length).toEqual(2);
//         });

//         it('should contain Buttons with onClick defined', () => {
//             const firstSubtotalWithActionButtons = wrapper.find('SubtotalWithActionButtons').at(0);
//             const firstButton = firstSubtotalWithActionButtons.dive().find('Button').at(0);
//             expect(firstButton.prop('onClick').toString()).toContain('setNextPageData');
//         });

//         it('should contain one Link component', () => {
//             const link = wrapper.find('Link');
//             expect(link.length).toEqual(1);
//         });
//     });

//     describe('getModalItemMessages method', () => {
//         it('should set the item level messages in the state', () => {
//             // Arrange
//             const thisProps = {
//                 sku: {
//                     skuId: '123456'
//                 }
//             };
//             const basket = {
//                 items: [
//                     {
//                         itemLevelMessages: [
//                             {
//                                 messageContext: 'vibFreeShipping.enrollingInFlash',
//                                 messages: ['You will be enrolling in FLASH 2-Day shipping'],
//                                 type: 'warning'
//                             }
//                         ],
//                         sku: {
//                             skuId: '123456'
//                         }
//                     }
//                 ]
//             };
//             const setAndWatchBasketItemsStub = spyOn(store, 'setAndWatch');
//             spyOn(localeUtils, 'isCanada').and.returnValue(false);

//             // Act
//             component = shallow(<AddToBasketModal {...thisProps} />).instance();
//             setAndWatchBasketItemsStub.calls.argsFor(1)[2](basket);

//             // Assert
//             expect(component.state).toEqual({
//                 itemLevelMessages: ['You will be enrolling in FLASH 2-Day shipping'],
//                 basket: null,
//                 hideSampleAndRewardsOnATB: false
//             });
//         });
//     });
// });
