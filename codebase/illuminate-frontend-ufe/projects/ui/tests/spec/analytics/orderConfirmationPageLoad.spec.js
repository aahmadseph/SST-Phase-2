/* eslint max-len: [0] */
describe('analytics on order confirmation page load', function () {
    let store;
    let setCustomUserAttributeStub;
    let setMboxTrackEventSpy;
    let bindingMethods;
    let originalGetEventStrings;
    let originalGetState;

    beforeEach(() => {
        store = require('store/Store').default;
        global.adobe = { target: { trackEvent: function () {} } };
        setCustomUserAttributeStub = jasmine.createSpy();
        bindingMethods = require('analytics/bindingMethods/pages/orderConfirmation/orderConfPageBindings').default;
        originalGetEventStrings = bindingMethods.getEventStrings;
        setMboxTrackEventSpy = spyOn(global.adobe.target, 'trackEvent');
        bindingMethods.getEventStrings = () => {};

        global.braze = {
            getUser: () => {
                return { setCustomUserAttribute: setCustomUserAttributeStub };
            }
        };

        Sephora.analytics.promises.brazeIsReady = {
            then: callback => {
                callback();
            }
        };

        originalGetState = store.getState;

        store.getState = function () {
            return {
                order: {
                    orderDetails: {
                        header: { profileLocale: '' },
                        priceInfo: {
                            giftCardAmount: 0,
                            orderTotal: 0
                        },
                        items: { items: [] },
                        paymentGroups: { paymentGroupsEntries: [] }
                    }
                }
            };
        };
        digitalData.transaction = {
            attributes: {},
            total: {}
        };

        require('analytics/bindings/pages/orderConfirmation/orderConfirmationPageLoad').default();
    });

    afterEach(() => {
        bindingMethods.getEventStrings = originalGetEventStrings;
        store.getState = originalGetState;
    });

    describe('mbox value when it is NOT ROPIS', () => {
        beforeEach(() => {
            global.adobe = { target: { trackEvent: function () {} } };
            setMboxTrackEventSpy = spyOn(global.adobe.target, 'trackEvent');
            store.getState = function () {
                return {
                    order: {
                        orderDetails: {
                            header: {
                                profileLocale: '',
                                isRopisOrder: false
                            },
                            priceInfo: {
                                giftCardAmount: 0,
                                orderTotal: 0
                            },
                            items: { items: [] },
                            paymentGroups: { paymentGroupsEntries: [] }
                        }
                    }
                };
            };

            require('analytics/bindings/pages/orderConfirmation/orderConfirmationPageLoad').default();
        });

        it('should send mbox "orderConfirmPage" to Adobe trackEvent function when is NOT ROPIS', () => {
            expect(setMboxTrackEventSpy).toHaveBeenCalledWith({
                mbox: 'orderConfirmPage',
                params: {
                    orderId: undefined,
                    orderTotal: '0',
                    productPurchasedId: ''
                }
            });
        });
    });

    describe('mbox value when it is ROPIS', () => {
        beforeEach(() => {
            global.adobe = { target: { trackEvent: function () {} } };
            setMboxTrackEventSpy = spyOn(global.adobe.target, 'trackEvent');
            store.getState = function () {
                return {
                    order: {
                        orderDetails: {
                            header: {
                                profileLocale: '',
                                isRopisOrder: true
                            },
                            priceInfo: {
                                giftCardAmount: 0,
                                orderTotal: 0
                            },
                            items: { items: [] },
                            paymentGroups: { paymentGroupsEntries: [] }
                        }
                    }
                };
            };

            require('analytics/bindings/pages/orderConfirmation/orderConfirmationPageLoad').default();
        });

        it('should send mbox "orderConfirmROPIS" to Adobe trackEvent function when is ROPIS', () => {
            expect(setMboxTrackEventSpy).toHaveBeenCalledWith({
                mbox: 'orderConfirmROPIS',
                params: {
                    orderId: undefined,
                    orderTotal: '0',
                    productPurchasedId: ''
                }
            });
        });
    });

    describe('mbox for BOPIS', () => {
        beforeEach(() => {
            global.adobe = { target: { trackEvent: function () {} } };
            setMboxTrackEventSpy = spyOn(global.adobe.target, 'trackEvent');
            store.getState = function () {
                return {
                    order: {
                        orderDetails: {
                            header: {
                                profileLocale: '',
                                isBopisOrder: true
                            },
                            priceInfo: {
                                giftCardAmount: 0,
                                orderTotal: 0
                            },
                            items: { items: [] },
                            paymentGroups: { paymentGroupsEntries: [] }
                        }
                    }
                };
            };

            require('analytics/bindings/pages/orderConfirmation/orderConfirmationPageLoad').default();
        });

        it('should send mbox "orderConfirmBOPIS" to Adobe trackEvent function when is BOPIS', () => {
            expect(setMboxTrackEventSpy).toHaveBeenCalledWith({
                mbox: 'orderConfirmBOPIS',
                params: {
                    orderId: undefined,
                    orderTotal: '0',
                    productPurchasedId: ''
                }
            });
        });
    });
});
