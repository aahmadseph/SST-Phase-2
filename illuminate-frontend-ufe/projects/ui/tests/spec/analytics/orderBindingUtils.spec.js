/* eslint max-len: [0] */
import orderBindingUtils from 'analytics/bindingMethods/pages/orderBindingUtils/orderBindingUtils';

describe('order confirmation bindings group', function () {
    const orderItems = [
        {
            listPriceSubtotal: '$42.00',
            qty: 2,
            replenishmentFrequency: 'Weeks:2',
            sku: {
                type: 'Standard',
                skuId: '1056084'
            }
        },
        {
            listPriceSubtotal: '$50.00',
            qty: 1,
            replenishmentFrequency: 'Months:3',
            sku: {
                type: 'Standard',
                skuId: '1052345'
            }
        }
    ];
    const orderItemsGiftCard = [
        {
            listPriceSubtotal: '$10.00',
            qty: 1,
            sku: { type: 'Gift Card' }
        }
    ];
    const orderItemsSample = [
        {
            listPriceSubtotal: '$10.00',
            qty: 1,
            sku: { type: 'Sample' }
        }
    ];

    describe('getPriceForProductString', () => {
        const priceForGiftCard = '';
        const priceForSampleOrReward = '0';
        const priceForStandard = '42.00';

        it('should return a semicolon if gift card sku', () => {
            expect(orderBindingUtils.getPriceForProductString(orderItemsGiftCard[0])).toEqual(priceForGiftCard);
        });
        it('should return 0 with a semicolon if gift card sku', () => {
            expect(orderBindingUtils.getPriceForProductString(orderItemsSample[0])).toEqual(priceForSampleOrReward);
        });
        it('should return the price with a semicolon if a standard sku', () => {
            expect(orderBindingUtils.getPriceForProductString(orderItems[0])).toEqual(priceForStandard);
        });
    });
});
