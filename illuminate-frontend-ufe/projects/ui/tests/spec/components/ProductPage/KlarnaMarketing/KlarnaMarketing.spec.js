// const React = require('react');
// const { shallow } = require('enzyme');
// const { objectContaining } = jasmine;
// const store = require('Store').default;
// const actions = require('Actions').default;
// const processEvent = require('analytics/processEvent').default;
// const anaConsts = require('analytics/constants').default;
// const anaUtils = require('analytics/utils').default;
// const KlarnaMarketing = require('components/ProductPage/KlarnaMarketing/KlarnaMarketing').default;

// describe('rwd KlarnaMarketing', () => {
//     let sku;
//     let processSpy;
//     let pageName;
//     let wrapper;
//     let component;
//     let dispatchSpy;
//     let showBuyNowPayLaterModalSpy;
//     let triggerAsyncPageLoadEventSpy;
//     let props;

//     beforeEach(() => {
//         sku = {
//             salePrice: '$8.00',
//             listPrice: '$9.00'
//         };
//         pageName = 'analyticsContext';
//         processSpy = spyOn(processEvent, 'process');
//         props = {
//             sku,
//             analyticsContext: pageName,
//             isKlarnaEnabled: true
//         };
//         wrapper = shallow(<KlarnaMarketing {...props} />);
//         component = wrapper.instance();
//     });

//     describe('klarnaTreatment Test when klarnaTreatment: new', () => {
//         beforeEach(() => {
//             wrapper.setState({
//                 showNewKlarnaTreatment: true,
//                 showCreditCardOffer: false
//             });
//         });
//         it('should show Klarna image', () => {
//             const imageSrc = wrapper.find('Image').at(0).prop('src');
//             expect(imageSrc).toEqual('/img/ufe/logo-klarna.svg');
//         });
//     });

//     describe('showCreditCardOffer a/b test when test group is not the control', () => {
//         beforeEach(() => {
//             const newProps = {
//                 ...props,
//                 isKlarnaEnabled: false
//             };
//             wrapper = shallow(<KlarnaMarketing {...newProps} />);
//             wrapper.setState({ showCreditCardOffer: true });
//         });
//         it('should not show Klarna logo', () => {
//             const imageSrc = wrapper.findWhere(image => image.name() === 'Image' && image.prop('src') === '/img/ufe/logo-klarna.svg');
//             expect(imageSrc.length).toBe(0);
//         });

//         it('should show see details link on product page', () => {
//             const seeDetailsLink = wrapper.find('Link');
//             expect(seeDetailsLink.length).toBe(1);
//             expect(seeDetailsLink.prop('children')).toEqual('See details');
//         });
//     });

//     describe('Klarna && AfterPay logo', () => {
//         it('should render only the Klarna logo when Klarna is enabled and Afterpay is not', () => {
//             const newProps = {
//                 ...props,
//                 isAfterpayEnabled: false,
//                 isKlarnaEnabled: true
//             };
//             wrapper = shallow(<KlarnaMarketing {...newProps} />);
//             const imageSrc = wrapper.find('Image').at(0).prop('src');
//             expect(imageSrc).toEqual('/img/ufe/logo-klarna.svg');
//             expect(wrapper.find('Image').length).toEqual(1);
//         });

//         it('should render only the AfterPay logo when AfterPay is enabled and Klarna is not', () => {
//             const newProps = {
//                 ...props,
//                 isAfterpayEnabled: true,
//                 isKlarnaEnabled: false
//             };
//             wrapper = shallow(<KlarnaMarketing {...newProps} />);
//             const imageSrc = wrapper.find('Image').at(0).prop('src');
//             expect(imageSrc).toEqual('/img/ufe/logo-afterpay.svg');
//             expect(wrapper.find('Image').length).toEqual(1);
//         });

//         it('should render the Klarna and AfterPay logos when both are enabled', () => {
//             const newProps = {
//                 ...props,
//                 isAfterpayEnabled: true,
//                 isKlarnaEnabled: true
//             };
//             wrapper = shallow(<KlarnaMarketing {...newProps} />);
//             const imageSrcKlarna = wrapper.find('Image').at(0).prop('src');
//             const imageSrcAfterPay = wrapper.find('Image').at(1).prop('src');
//             expect(imageSrcKlarna).toEqual('/img/ufe/logo-klarna.svg');
//             expect(imageSrcAfterPay).toEqual('/img/ufe/logo-afterpay.svg');
//             expect(wrapper.find('Image').length).toEqual(2);
//         });
//     });

//     describe('InfoButton', () => {
//         it('should show InfoButton', () => {
//             expect(wrapper.find('InfoButton').length).toBe(1);
//         });
//     });

//     describe('showModal', () => {
//         const installmentValue = 1;
//         const totalAmount = 2;

//         beforeEach(() => {
//             dispatchSpy = spyOn(store, 'dispatch');
//             component.showModal(installmentValue, totalAmount);
//         });

//         it('should call the dispatch once', () => {
//             expect(dispatchSpy).toHaveBeenCalledTimes(1);
//         });

//         it('should call dispatch with the correct action and result', () => {
//             expect(dispatchSpy).toHaveBeenCalledWith({
//                 type: actions.TYPES.SHOW_BUY_NOW_PAY_LATER_MODAL,
//                 isOpen: true,
//                 installmentValue,
//                 totalAmount,
//                 showAfterpay: undefined,
//                 showKlarna: true,
//                 showPaypal: undefined,
//                 selectedPaymentMethod: undefined
//             });
//         });

//         it('should call the showBuyNowPayLaterModal action once', () => {
//             showBuyNowPayLaterModalSpy = spyOn(actions, 'showBuyNowPayLaterModal');
//             component.showModal();
//             expect(showBuyNowPayLaterModalSpy).toHaveBeenCalledTimes(1);
//         });

//         it('should call the triggerAsyncPageLoadEvent method once', () => {
//             triggerAsyncPageLoadEventSpy = spyOn(component, 'triggerAsyncPageLoadEvent');
//             component.showModal();
//             expect(triggerAsyncPageLoadEventSpy).toHaveBeenCalledTimes(1);
//         });
//     });

//     describe('triggerAsyncPageLoadEvent', () => {
//         it('should call the process method', () => {
//             component.triggerAsyncPageLoadEvent();
//             expect(processSpy).toHaveBeenCalled();
//         });

//         it('should call the process method with the correct event', () => {
//             component.triggerAsyncPageLoadEvent();
//             expect(processSpy.calls.first().args[0]).toEqual(anaConsts.ASYNC_PAGE_LOAD);
//         });

//         describe('should call the process method with correct analytics data', () => {
//             it('for previousPageName', () => {
//                 spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({ pageName });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({ data: objectContaining({ previousPageName: pageName }) });
//             });

//             it('when Afterpay and Klarna are enabled', () => {
//                 wrapper.setProps({ isAfterpayEnabled: true });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.PRODUCT}:${anaConsts.PAGE_DETAIL.FLEXIBLE_PAYMENTS} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.PRODUCT,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.FLEXIBLE_PAYMENTS} modal`
//                     })
//                 });
//             });

//             it('when only Afterpay is enabled', () => {
//                 wrapper.setProps({
//                     isAfterpayEnabled: true,
//                     isKlarnaEnabled: false
//                 });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.PRODUCT}:${anaConsts.PAGE_DETAIL.AFTERPAY_PAYMENT} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.PRODUCT,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.AFTERPAY_PAYMENT} modal`
//                     })
//                 });
//             });

//             it('when only Klarna is enabled', () => {
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.PRODUCT}:${anaConsts.PAGE_DETAIL.KLARNA_PAYMENT} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.PRODUCT,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.KLARNA_PAYMENT} modal`
//                     })
//                 });
//             });
//         });
//     });
// });
