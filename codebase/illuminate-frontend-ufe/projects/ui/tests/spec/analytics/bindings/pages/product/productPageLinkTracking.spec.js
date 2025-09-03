/* eslint-disable array-bracket-spacing */
/* eslint-disable object-curly-newline */
const { modalVideoClickBindings } = require('analytics/bindings/pages/product/productPageLinkTracking').default;
const {
    EVENT_NAMES: { HERO_VIDEO_CLICK },
    Event: { EVENT_71, EVENT_102 }
} = require('analytics/constants').default;

describe('analytics on product page link tracking', () => {
    let originalProduct;

    beforeEach(() => {
        originalProduct = window.digitalData.product;
    });

    afterEach(() => {
        window.digitalData.product = originalProduct;
    });

    it('modalVideoClickBindings should return object with required fields', () => {
        // Arrange
        const item = {
            videoTitle: 'videoTitle',
            filePath: 'filePath'
        };
        window.digitalData.product = [
            {
                attributes: {
                    world: 'US'
                }
            }
        ];

        // Act
        const binding = modalVideoClickBindings(item, HERO_VIDEO_CLICK);

        //Assert
        expect(binding).toEqual({
            specificEventName: HERO_VIDEO_CLICK,
            linkName: 'video popup',
            actionInfo: 'video popup',
            eventStrings: [EVENT_71, EVENT_102],
            videoName: `_${item.videoTitle}_${item.filePath}`,
            eVar63: 'D=g',
            internalCampaign: `product_${window.digitalData.product[0].attributes.world}_video`
        });
    });
});
