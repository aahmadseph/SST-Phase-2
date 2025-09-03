/* eslint-disable no-unused-vars */
describe('QuicklookModal', () => {
    let snbApi;
    let quickLookBindings;
    let quickLookBindingsSpy;
    let fakePromise;
    let storeSpy;
    let updateQuickLookContentSpy;
    let showQuickLookModalSpy;
    let quicklookModalUtils;

    const dispatchQuickLookArgs = {
        productId: 'P123',
        skuType: 'standard',
        options: { addCurrentSkuToProductChildSkus: true },
        sku: { skuId: 'S123' },
        rootContainerName: 'Just Arrived',
        productStringContainerName: 'Just Arrived'
    };

    beforeEach(() => {
        quicklookModalUtils = require('utils/Quicklook').default;
        storeSpy = spyOn(require('Store').default, 'dispatch');
        snbApi = require('services/api/search-n-browse').default;
        quickLookBindings = require('analytics/bindingMethods/pages/all/quickLookBindings').default;
        quickLookBindingsSpy = spyOn(quickLookBindings, 'buildProductString').and.returnValue('productString');
        const actions = require('Actions').default;
        updateQuickLookContentSpy = spyOn(actions, 'updateQuickLookContent');
        showQuickLookModalSpy = spyOn(actions, 'showQuickLookModal');
    });

    it('should dispatch updateQuickLookContent', done => {
        const product = { productId: 'P123' };
        fakePromise = {
            then: function (resolve) {
                resolve(product);

                expect(updateQuickLookContentSpy).toHaveBeenCalledWith(product, { skuId: 'S123' });

                done();

                return fakePromise;
            },
            catch: function () {
                return function () {};
            }
        };

        spyOn(snbApi, 'getProductDetails').and.returnValue(fakePromise);
        quicklookModalUtils.dispatchQuicklook(dispatchQuickLookArgs);
    });

    it('should dispatch showQuickLookModal', done => {
        const product = { productId: 'P123123' };
        fakePromise = {
            then: function (resolve) {
                resolve(product);

                expect(showQuickLookModalSpy).toHaveBeenCalledWith({
                    isOpen: true,
                    skuType: 'standard',
                    sku: { skuId: 'S123' },
                    error: null,
                    platform: null,
                    origin: undefined,
                    analyticsContext: undefined,
                    isDisabled: undefined,
                    rootContainerName: 'Just Arrived',
                    pageName: 'quicklook:P123123:n/a:*pname=undefined',
                    eventStrings: ['event24', 'event25'],
                    productStrings: 'productString',
                    categoryProducts: [],
                    isCommunityGallery: false,
                    communityGalleryAnalytics: undefined
                });

                done();

                return fakePromise;
            },
            catch: function () {
                return function () {};
            }
        };

        spyOn(snbApi, 'getProductDetails').and.returnValue(fakePromise);
        quicklookModalUtils.dispatchQuicklook(dispatchQuickLookArgs);
    });
});
