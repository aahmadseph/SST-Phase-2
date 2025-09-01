// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');
// const { objectContaining } = jasmine;
// const store = require('Store').default;
// const actions = require('Actions').default;
// const KlarnaMarketing = require('components/Klarna/KlarnaMarketing/KlarnaMarketing').default;
// const processEvent = require('analytics/processEvent').default;
// const anaConsts = require('analytics/constants').default;
// const Location = require('utils/Location').default;
// const anaUtils = require('analytics/utils').default;
// const skuUtils = require('utils/Sku').default;

// describe('KlarnaMarketing', () => {
//     let wrapper;
//     let component;
//     let sku;
//     let processSpy;
//     let pageName;
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

//     describe('rendering', () => {
//         it('should render the component children', () => {
//             expect(wrapper.children().length).not.toEqual(0);
//         });

//         it('should not render the component children if there is not installment value', () => {
//             spyOn(skuUtils, 'getInstallmentValue').and.returnValue(undefined);
//             component.forceUpdate();
//             wrapper.update();
//             expect(wrapper.children().length).toEqual(0);
//         });

//         it('should render only the Logo for PayPal when payPalLater is enabled and klarna and afterpay are not', () => {
//             const newProps = {
//                 ...props,
//                 isAfterpayEnabled: false,
//                 isKlarnaEnabled: false,
//                 isPayPalPayLaterEligibleEnabled: true
//             };
//             wrapper = shallow(<KlarnaMarketing {...newProps} />);
//             expect(wrapper.find('Image').prop('src')).toContain('paypal');
//         });

//         it('should render payPalLater and Klarna logos when both are enabled and afterPay is not', () => {
//             const newProps = {
//                 ...props,
//                 isAfterpayEnabled: false,
//                 isKlarnaEnabled: true,
//                 isPayPalPayLaterEligibleEnabled: true
//             };
//             wrapper = shallow(<KlarnaMarketing {...newProps} />);
//             const imageSrcKlarna = wrapper.find('Image').at(0).prop('src');
//             const imageSrcPayPalLater = wrapper.find('Image').at(1).prop('src');
//             expect(imageSrcKlarna).toEqual('/img/ufe/logo-klarna.svg');
//             expect(imageSrcPayPalLater).toEqual('/img/ufe/logo-paypal.svg');
//             expect(wrapper.find('Image').length).toEqual(2);
//         });

//         it('should render the correct logo image for Klarna', () => {
//             expect(wrapper.find('Image').prop('src')).toContain('klarna');
//         });

//         it('should render the InfoButton component', () => {
//             expect(wrapper.find('InfoButton').length).toEqual(1);
//         });

//         it('should render data-at for icon', () => {
//             expect(wrapper.find('[data-at="info_icon"]').exists()).toBe(true);
//         });

//         it('should render data-at for icon', () => {
//             expect(wrapper.find('[data-at="klarna_info_block"]').exists()).toBe(true);
//         });

//         it('should render data-at for icon', () => {
//             expect(wrapper.find('[data-at="klarna_info_message"]').exists()).toBe(true);
//         });

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

//             it('on checkout page when Afterpay and Klarna are enabled', () => {
//                 spyOn(Location, 'isCheckout').and.returnValue(true);
//                 wrapper.setProps({
//                     analyticsPageType: anaConsts.PAGE_TYPES.CHECKOUT,
//                     isAfterpayEnabled: true
//                 });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.CHECKOUT}:${anaConsts.PAGE_DETAIL.FLEXIBLE_PAYMENTS} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.CHECKOUT,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.FLEXIBLE_PAYMENTS} modal`
//                     })
//                 });
//             });

//             it('on checkout page when only Afterpay is enabled', () => {
//                 spyOn(Location, 'isCheckout').and.returnValue(true);
//                 wrapper.setProps({
//                     analyticsPageType: anaConsts.PAGE_TYPES.CHECKOUT,
//                     isAfterpayEnabled: true,
//                     isKlarnaEnabled: false
//                 });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.CHECKOUT}:${anaConsts.PAGE_DETAIL.AFTERPAY_PAYMENT} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.CHECKOUT,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.AFTERPAY_PAYMENT} modal`
//                     })
//                 });
//             });

//             it('on checkout page when only Klarna is enabled', () => {
//                 spyOn(Location, 'isCheckout').and.returnValue(true);
//                 wrapper.setProps({ analyticsPageType: anaConsts.PAGE_TYPES.CHECKOUT });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.CHECKOUT}:${anaConsts.PAGE_DETAIL.KLARNA_PAYMENT} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.CHECKOUT,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.KLARNA_PAYMENT} modal`
//                     })
//                 });
//             });

//             it('on basket page when Afterpay and Klarna are enabled', () => {
//                 spyOn(Location, 'isBasketPage').and.returnValue(true);
//                 wrapper.setProps({
//                     analyticsPageType: anaConsts.PAGE_TYPES.BASKET,
//                     isAfterpayEnabled: true
//                 });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.BASKET}:${anaConsts.PAGE_DETAIL.FLEXIBLE_PAYMENTS} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.BASKET,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.FLEXIBLE_PAYMENTS} modal`
//                     })
//                 });
//             });

//             it('on basket page when only Afterpay is enabled', () => {
//                 spyOn(Location, 'isBasketPage').and.returnValue(true);
//                 wrapper.setProps({
//                     analyticsPageType: anaConsts.PAGE_TYPES.BASKET,
//                     isAfterpayEnabled: true,
//                     isKlarnaEnabled: false
//                 });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.BASKET}:${anaConsts.PAGE_DETAIL.AFTERPAY_PAYMENT} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.BASKET,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.AFTERPAY_PAYMENT} modal`
//                     })
//                 });
//             });

//             it('on basket page when only Klarna is enabled', () => {
//                 spyOn(Location, 'isBasketPage').and.returnValue(true);
//                 wrapper.setProps({ analyticsPageType: anaConsts.PAGE_TYPES.BASKET });
//                 component.triggerAsyncPageLoadEvent();
//                 expect(processSpy.calls.first().args[1]).toEqual({
//                     data: objectContaining({
//                         pageName: `${anaConsts.PAGE_TYPES.BASKET}:${anaConsts.PAGE_DETAIL.KLARNA_PAYMENT} modal:n/a:*`,
//                         pageType: anaConsts.PAGE_TYPES.BASKET,
//                         pageDetail: `${anaConsts.PAGE_DETAIL.KLARNA_PAYMENT} modal`
//                     })
//                 });
//             });
//         });
//     });
// });
