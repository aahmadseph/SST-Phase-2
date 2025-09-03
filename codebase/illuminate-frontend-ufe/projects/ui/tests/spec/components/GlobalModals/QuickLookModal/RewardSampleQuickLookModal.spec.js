// const React = require('react');
// const { any } = jasmine;
// const { shallow } = require('enzyme');
// const store = require('Store').default;
// const anaUtils = require('analytics/utils').default;
// const skuUtils = require('utils/Sku').default;
// const RewardQuickLookModal = require('components/GlobalModals/QuickLookModal/RewardSampleQuickLookModal/RewardSampleQuickLookModal').default;

// describe('RewardSampleQuickLookModal component', () => {
//     let setStateStub;
//     let subscribeStub;
//     let props;
//     let component;
//     let isInBasketSpy;
//     let isRewardDisabledSpy;

//     beforeEach(() => {
//         subscribeStub = spyOn(store, 'subscribe');
//         spyOn(store, 'getState').and.returnValue({
//             basket: {},
//             user: {}
//         });
//         props = {
//             currentSku: { skuId: 1 },
//             isOpen: true,
//             requestClose: () => {},
//             product: { productDetails: {} },
//             rewardInfo: { skuImages: {} }
//         };

//         isInBasketSpy = spyOn(skuUtils, 'isInBasket');
//         isRewardDisabledSpy = spyOn(skuUtils, 'isRewardDisabled');
//     });

//     describe('Set initial State for Reward', () => {
//         it('should call isInBasket and isRewardDisabled functions', () => {
//             const wrapper = shallow(<RewardQuickLookModal {...props} />);
//             component = wrapper.instance();
//             setStateStub = spyOn(component, 'setState');
//             component.componentDidMount();

//             expect(isInBasketSpy).toHaveBeenCalledWith(props.currentSku.skuId);
//             expect(isRewardDisabledSpy).toHaveBeenCalledWith(props.currentSku);
//         });

//         it('should change rewards flag to true if isInBasket and isRewardDisabled are truthy', () => {
//             isInBasketSpy.and.returnValue(true);
//             isRewardDisabledSpy.and.returnValue(true);

//             const wrapper = shallow(<RewardQuickLookModal {...props} />);
//             component = wrapper.instance();
//             setStateStub = spyOn(component, 'setState');
//             component.componentDidMount();

//             expect(setStateStub).toHaveBeenCalledWith({
//                 isInBasket: true,
//                 isRewardDisabled: true
//             });
//         });

//         it('should change rewards flag to true if isInBasket and isRewardDisabled are falsy', () => {
//             isInBasketSpy.and.returnValue(false);
//             isRewardDisabledSpy.and.returnValue(false);

//             const wrapper = shallow(<RewardQuickLookModal {...props} />);
//             component = wrapper.instance();
//             setStateStub = spyOn(component, 'setState');
//             component.componentDidMount();

//             expect(setStateStub).toHaveBeenCalledWith({
//                 isInBasket: false,
//                 isRewardDisabled: false
//             });
//         });

//         it('should subscribe on basket changes', () => {
//             // Arrange
//             component = shallow(<RewardQuickLookModal {...props} />).instance();
//             setStateStub = spyOn(component, 'setState');

//             // Act
//             component.componentDidMount();

//             // Assert
//             expect(subscribeStub).toHaveBeenCalledWith(any(Function), component);
//         });
//     });

//     describe('fireLinkTracking()', () => {
//         let getLinkTrackingDataStub;
//         let setNextPageDataStub;
//         let setNextPageDataAndRedirectStub;
//         const trackingData = {
//             platform: 'one',
//             nextPageData: 'two'
//         };
//         const trackingDataProcessed = {
//             a: 1,
//             b: 2
//         };

//         beforeEach(() => {
//             component = shallow(<RewardQuickLookModal {...props} />).instance();
//             getLinkTrackingDataStub = spyOn(component, 'getLinkTrackingData').and.returnValue(trackingDataProcessed);
//             setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
//             setNextPageDataAndRedirectStub = spyOn(anaUtils, 'setNextPageDataAndRedirect');
//         });

//         it('should call getLinkTrackingData with correct args', () => {
//             component.fireLinkTracking(null, null, trackingData);
//             expect(getLinkTrackingDataStub).toHaveBeenCalledWith('one', 'two');
//         });

//         it('should call setNextPageData if no url passed', () => {
//             component.fireLinkTracking(null, null, trackingData);
//             expect(setNextPageDataStub).toHaveBeenCalledWith(trackingDataProcessed);
//         });

//         it('should call setNextPageDataAndRedirect if url is passed', () => {
//             component.fireLinkTracking('evt', 'https://example.com', trackingData);
//             expect(setNextPageDataAndRedirectStub).toHaveBeenCalledWith('evt', {
//                 trackingData: trackingDataProcessed,
//                 destination: 'https://example.com'
//             });
//         });
//     });

//     describe('getLinkTrackingData()', () => {
//         beforeEach(() => {
//             digitalData.event = [
//                 {
//                     eventInfo: {
//                         eventName: 'asyncPageLoad',
//                         attributes: {
//                             pageType: 'quicklook',
//                             pageName: 'quicklook pageName'
//                         }
//                     }
//                 }
//             ];
//             component = shallow(<RewardQuickLookModal {...props} />).instance();
//         });

//         it('should call return correct trackingData', () => {
//             const linkData = 'quicklook_prod-image_click';
//             expect(component.getLinkTrackingData()).toEqual({
//                 pageName: 'quicklook pageName',
//                 linkData,
//                 internalCampaign: linkData
//             });
//         });

//         it('should call return correct trackingData when there is a platform', () => {
//             const platform = 'platform';
//             const linkData = 'cmnty:' + platform + ':product-tag-click-to-ppage';
//             expect(component.getLinkTrackingData(platform)).toEqual({
//                 pageName: 'quicklook pageName',
//                 linkData,
//                 internalCampaign: linkData
//             });
//         });

//         it('should call return correct trackingData when sending more nextPage data', () => {
//             const platform = 'platform';
//             const linkData = 'new link data';
//             expect(component.getLinkTrackingData(platform, { linkData })).toEqual({
//                 pageName: 'quicklook pageName',
//                 linkData,
//                 internalCampaign: linkData
//             });
//         });
//     });

//     describe('getBrandName()', () => {
//         describe('when currentSku is a Sample', () => {
//             beforeEach(() => {
//                 spyOn(skuUtils, 'isSample').and.returnValue(true);
//             });

//             it('should return product.productDetails.brand.displayName when product.productDetails.brand is defined', () => {
//                 props.product.productDetails.brand = { displayName: 'displayName' };
//                 component = shallow(<RewardQuickLookModal {...props} />).instance();
//                 expect(component.getBrandName()).toEqual(props.product.productDetails.brand.displayName);
//             });

//             it('should return currentSku.variationValue when product.productDetails.brand is falsy', () => {
//                 props.currentSku = { variationValue: 'variationValue' };
//                 component = shallow(<RewardQuickLookModal {...props} />).instance();
//                 expect(component.getBrandName()).toEqual(props.currentSku.variationValue);
//             });
//         });

//         describe('when currentSku is not a Sample', () => {
//             beforeEach(() => {
//                 spyOn(skuUtils, 'isSample').and.returnValue(false);
//             });

//             it('should return currentSku.brandName when it is defined', () => {
//                 props.currentSku = { brandName: 'brandName' };
//                 component = shallow(<RewardQuickLookModal {...props} />).instance();
//                 expect(component.getBrandName()).toEqual(props.currentSku.brandName);
//             });

//             it('should return currentSku.rewardsInfo.brandName when currentSku.brandName is falsy and currentSku.rewardsInfo is defined', () => {
//                 props.currentSku = { rewardsInfo: { brandName: 'brandName' } };
//                 component = shallow(<RewardQuickLookModal {...props} />).instance();
//                 expect(component.getBrandName()).toEqual(props.currentSku.rewardsInfo.brandName);
//             });

//             it('should return an empty string when currentSku.brandName and currentSku.rewardsInfo are falsy', () => {
//                 component = shallow(<RewardQuickLookModal {...props} />).instance();
//                 expect(component.getBrandName()).toEqual('');
//             });
//         });
//     });
// });
