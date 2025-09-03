const ProductUtils = require('utils/product').default;

describe('product utils', () => {
    describe('getMediaItems function', () => {
        it('should set altText prop for media item', () => {
            // Arrange
            const product = {
                currentSku: {
                    alternateImages: [{}, {}],
                    imageAltText: 'altText',
                    skuId: '1',
                    skuImages: {}
                },
                videoSeoJsonLd: 'productSeoJsonLd'
            };

            // Act
            const mediaItems = ProductUtils.getMediaItems(product);

            // Assert
            expect(mediaItems[0].media.altText).toEqual(product.currentSku.imageAltText);
        });

        it('should return items based on skuImages and alternateImages', () => {
            // Arrange
            const product = {
                currentSku: {
                    skuId: '1',
                    skuImages: {},
                    alternateImages: [{}, {}]
                },
                videoSeoJsonLd: 'productSeoJsonLd'
            };
            const actualLength = (product.currentSku.skuImages ? 1 : 0) + product.currentSku.alternateImages.length;

            // Act
            const mediaItems = ProductUtils.getMediaItems(product);

            // Assert
            expect(mediaItems.length).toEqual(actualLength);
        });
    });
});
