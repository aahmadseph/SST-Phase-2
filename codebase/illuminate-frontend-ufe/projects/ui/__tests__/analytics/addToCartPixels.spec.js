import addToCartPixels from 'analytics/addToCartPixels';
import anaConsts from 'analytics/constants';

const {
    EVENT_NAMES: { ADD_TO_BASKET, FACEBOOK_ADD_TO_BASKET, REMOVE_FROM_BASKET, GA_BEGIN_CHECKOUT }
} = anaConsts;

describe('addToCartPixels', () => {
    let dispatchEventSpy;

    beforeEach(() => {
        dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    });

    describe('pinterestAddToCartEvent', () => {
        it('should dispatch a "pinterestAddToCartEvent" custom event', async () => {
            // Arrange
            // prettier-ignore
            const mockData = {
                price: 100,
                'number_items': 2,
                currency: 'USD',
                'item_ids': ['sku1', 'sku2']
            };
            let resolve = null;
            Sephora.analytics.promises.PinterestBasePixelInitialized = new Promise(_resolve => (resolve = _resolve));
            // Sephora.analytics.promises.PinterestBasePixelInitialized = Promise.resolve();
            const event = {
                type: 'pinterestAddToCartEvent',
                detail: mockData
            };

            // Act
            addToCartPixels.pinterestAddToCartEvent(mockData);
            resolve();
            await Sephora.analytics.promises.PinterestBasePixelInitialized;

            // Assert
            expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining(event));
        });

        it('should not dispatch a "pinterestAddToCartEvent" custom event when PinterestBasePixelInitialized promise is unresolved', async () => {
            // Arrange
            // prettier-ignore
            const mockData = {
                price: 100,
                'number_items': 2,
                currency: 'USD',
                'item_ids': ['sku1', 'sku2']
            };
            Sephora.analytics.promises.PinterestBasePixelInitialized = new Promise(() => {});

            // Act
            addToCartPixels.pinterestAddToCartEvent(mockData);

            // Assert
            expect(dispatchEventSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('snapChatAddToCartEvent', () => {
        it('should dispatch a "snapChatAddToCartEvent" custom event', () => {
            // Arrange
            // prettier-ignore
            const mockData = {
                price: 50,
                'number_items': 1,
                currency: 'USD',
                'item_ids': 'sku1'
            };
            const event = {
                type: 'snapChatAddToCartEvent',
                detail: mockData
            };

            // Act
            addToCartPixels.snapChatAddToCartEvent(50, 1, 'USD', ['sku1']);

            // Assert
            expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining(event));
        });
    });

    describe('googleAnalyticsAddToBasketEvent', () => {
        it('should dispatch an "ADD_TO_BASKET" custom event', () => {
            // Arrange
            const mockData = {
                id: 'sku1',
                name: 'Product 1',
                price: 100
            };
            const event = {
                type: ADD_TO_BASKET,
                detail: mockData
            };

            // Act
            addToCartPixels.googleAnalyticsAddToBasketEvent(mockData);

            // Assert
            expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining(event));
        });
    });

    describe('facebookAddToBasketEvent', () => {
        it('should dispatch a "FACEBOOK_ADD_TO_BASKET" custom event', () => {
            // Arrange
            const mockData = {
                id: 'sku1',
                quantity: 1,
                price: 100,
                currency: 'USD'
            };
            const event = {
                type: FACEBOOK_ADD_TO_BASKET,
                detail: mockData
            };

            // Act
            addToCartPixels.facebookAddToBasketEvent(mockData);

            // Assert
            expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining(event));
        });
    });

    describe('googleAnalyticsRemoveFromBasketEvent', () => {
        it('should dispatch a "REMOVE_FROM_BASKET" custom event', () => {
            // Arrange
            const mockData = {
                id: 'sku1',
                quantity: 1
            };
            const event = {
                type: REMOVE_FROM_BASKET,
                detail: mockData
            };

            // Act
            addToCartPixels.googleAnalyticsRemoveFromBasketEvent(mockData);

            // Assert
            expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining(event));
        });
    });

    describe('googleAnalyticsBeginCheckout', () => {
        it('should dispatch a "GA_BEGIN_CHECKOUT" custom event', () => {
            // Arrange
            const event = { type: GA_BEGIN_CHECKOUT };

            // Act
            addToCartPixels.googleAnalyticsBeginCheckout();

            // Assert
            expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining(event));
        });
    });
});
