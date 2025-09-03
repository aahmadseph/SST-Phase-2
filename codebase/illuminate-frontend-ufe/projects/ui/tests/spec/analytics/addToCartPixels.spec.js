describe('add to cart pixels', () => {
    const anaConsts = require('analytics/constants').default;

    let addToCartPixels;
    let originalPromise;
    let promiseSpy;
    let fakePromise;

    beforeEach(() => {
        addToCartPixels = require('analytics/addToCartPixels').default;
        promiseSpy = jasmine.createSpy();
        fakePromise = { then: promiseSpy };
        originalPromise = Sephora.analytics.promises.PinterestBasePixelInitialized;
        Sephora.analytics = {
            promises: {
                PinterestBasePixelInitialized: fakePromise,
                snapChatReady: fakePromise
            }
        };
    });

    afterEach(() => {
        Sephora.analytics.promises.PinterestBasePixelInitialized = originalPromise;
    });

    describe('pinterestAddToCartEvent', () => {
        it('should call pintrk pixel', () => {
            addToCartPixels.pinterestAddToCartEvent('someAmount', 'someQty', 'someCurrency', 'someItems');
            expect(promiseSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('googleAnalyticsAddToBasketEvent ', () => {
        it('should dispatch an add_to_basket custom event', () => {
            const addToBasketSpy = spyOn(window, 'dispatchEvent');
            const mockSkuData = {
                id: 's1234567',
                name: 'Matte Revolution Lipstick',
                brand: 'Charlotte Tilbury',
                category: 'Makeup',
                variant: 'Color',
                skuType: 'Standard',
                quantity: 1,
                price: '77.00'
            };
            addToCartPixels.googleAnalyticsAddToBasketEvent(mockSkuData);
            expect(addToBasketSpy.calls.first().args[0]).toEqual(jasmine.objectContaining({ type: anaConsts.EVENT_NAMES.ADD_TO_BASKET }));
        });
    });

    describe('googleAnalyticsRemoveFromBasketEvent ', () => {
        it('should dispatch a RemoveFromBasket custom event', () => {
            const removeFromBasketSpy = spyOn(window, 'dispatchEvent');
            addToCartPixels.googleAnalyticsRemoveFromBasketEvent({});
            expect(removeFromBasketSpy.calls.first().args[0]).toEqual(jasmine.objectContaining({ type: anaConsts.EVENT_NAMES.REMOVE_FROM_BASKET }));
        });
    });
});
