/* eslint-disable no-console */
const { shallow } = enzyme;
const React = require('react');

describe('analytics checkout binding functions', () => {
    const bindingMethods = require('analytics/bindings/pages/checkout/checkoutBindings').default;
    const anaConsts = require('analytics/constants').default;
    const processEvent = require('analytics/processEvent').default;
    const anaUtils = require('analytics/utils').default;
    const {
        TYPES: { VALIDATE_ERRORS }
    } = require('actions/ErrorsActions').default;
    let checkoutUtils;

    beforeEach(() => {
        checkoutUtils = require('utils/Checkout').default;
    });

    describe('setPageName', () => {
        it('should set the correct pageName', () => {
            const focus = {
                isInitialized: true,
                shipAddress: true
            };
            const checkoutPath = checkoutUtils.CHECKOUT_SECTIONS.SHIP_ADDRESS.path;

            spyOn(checkoutUtils, 'isShipAddressComplete').and.callFake(() => false);
            bindingMethods.setPageName(focus, checkoutPath);
            expect(digitalData.page.pageInfo.pageName).toEqual(anaConsts.PAGE_NAMES.SHIPPING_ADD_ADDRESS);
        });

        it('should set the correct pageName when shipping address is complete', () => {
            const focus = {
                isInitialized: true,
                shipAddress: false
            };
            const checkoutPath = checkoutUtils.CHECKOUT_SECTIONS.SHIP_OPTIONS.path;

            spyOn(checkoutUtils, 'isShipAddressComplete').and.callFake(() => true);
            bindingMethods.setPageName(focus, checkoutPath);
            expect(digitalData.page.pageInfo.pageName).toEqual(checkoutPath);
        });
    });

    describe('setPageType', () => {
        it('should set the correct pageType', () => {
            bindingMethods.setPageType(false);
            expect(digitalData.page.category.pageType).toEqual(anaConsts.PAGE_TYPES.CHECKOUT);
        });
    });

    describe('processAsyncPageLoad', () => {
        it('should call process event with the correct data', () => {
            const processSpy = spyOn(processEvent, 'process');
            const pageTypeString = `${anaConsts.PAGE_TYPES.CHECKOUT}`;
            const checkoutPath = 'shipping';
            const data = {
                data: {
                    pageName: pageTypeString + ':' + anaUtils.convertName(checkoutPath) + ':n/a:*',
                    previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                    eventStrings: [anaConsts.Event.SC_CHECKOUT],
                    pageType: pageTypeString,
                    pageDetail: checkoutPath
                }
            };
            bindingMethods.processAsyncPageLoad(checkoutPath);
            expect(processSpy).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, data);
        });
    });

    describe('watchForErrors', () => {
        let store;
        let CheckoutMain;

        beforeAll(() => {
            // Load CheckoutMain and store one time only
            CheckoutMain = require('components/Checkout/CheckoutMain').default;
            store = require('store/Store').default;
        });

        beforeEach(() => {
            // Clear any previous dependencies or state
            Sephora.analytics.initialLoadDependencies = [];
            spyOn(checkoutUtils, 'changeCheckoutUrlBasedOnOrderCompleteness');
        });

        it('should watchAction for errors when CheckoutMain is rendered', () => {
            const watchAction = spyOn(store, 'watchAction');
            const wrapper = shallow(<CheckoutMain />);
            wrapper.instance().componentDidMount();

            expect(watchAction).toHaveBeenCalledWith(VALIDATE_ERRORS, jasmine.any(Function));
        });
    });
});
