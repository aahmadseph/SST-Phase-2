/* eslint-disable no-unused-vars */
const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('AndroidAppBanner component', () => {
    let wrapper;
    let AndroidAppBanner;
    let store;
    let Location;
    let cookieUtils;
    let subscribe;
    let isBasket;
    let bannerComponent;

    beforeEach(() => {
        store = require('store/Store').default;
        AndroidAppBanner = require('components/Banner/AndroidAppBanner/AndroidAppBanner').default;
        cookieUtils = require('utils/Cookies').default;
        Location = require('utils/Location').default;
        subscribe = spyOn(store, 'subscribe');
        isBasket = spyOn(Location, 'isBasketPage');
    });

    describe('controller initialization', () => {
        beforeEach(() => {
            wrapper = shallow(<AndroidAppBanner />);
            bannerComponent = wrapper.instance();
        });

        it('should be closed by default', () => {
            expect(bannerComponent.state.isOpen).toBe(false);
        });
    });

    describe('render component for Android device', () => {
        let __originalNavigator;
        const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

        beforeEach(() => {
            if (isChrome) {
                __originalNavigator = navigator.userAgent;
            } else {
                __originalNavigator = navigator;

                /* eslint-disable no-global-assign */
                navigator = {};

                /* eslint-disable no-proto */
                navigator.__proto__ = __originalNavigator;
            }

            /* eslint-disable no-global-assign */
            navigator.__defineGetter__('userAgent', () => 'Android');

            isBasket.and.returnValues(false);
            wrapper = shallow(<AndroidAppBanner />);
            bannerComponent = wrapper.instance();
        });

        afterEach(() => {
            if (isChrome) {
                navigator.__defineGetter__('userAgent', () => __originalNavigator);
            } else {
                navigator = __originalNavigator;
            }
        });

        it('should be opened by default if never visited before', () => {
            spyOn(cookieUtils, 'read').and.returnValues(false);
            expect(bannerComponent.shouldSeeBanner()).toBe(true);
        });

        it('should be closed by default on Basket page', () => {
            isBasket.and.returnValues(true);
            expect(bannerComponent.shouldSeeBanner()).toBe(false);
        });

        it('should be closed if was visited before', () => {
            spyOn(cookieUtils, 'read').and.returnValues(true);
            expect(bannerComponent.shouldSeeBanner()).toBe(false);
        });

        it('closeBanner function should hide the banner', () => {
            bannerComponent.closeBanner();
            expect(bannerComponent.state.isOpen).toBe(false);
        });
    });
});
