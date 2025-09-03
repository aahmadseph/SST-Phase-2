/* eslint-disable no-unused-vars */
const deepExtend = require('utils/deepExtend');
const extraProductDetailsUtils = require('utils/ExtraProductDetailsUtils').default;

describe('ExtraProductDetailsUtils', () => {
    let product;

    beforeEach(() => {
        product = {
            ancillarySkus: [],
            pickupMessage: null,
            content: {
                seoCanonicalUrl: '/product/nude-obsessions-eyeshadow-palette-P450887',
                seoKeywords: [],
                seoMetaDescription: 'Shop Huda Beauty’s Nude Obsessions Eyeshadow Palette at Sephora.',
                seoName: 'nude-obsessions-eyeshadow-palette-P450887',
                seoTitle: 'Nude Obsessions Eyeshadow Palette - HUDA BEAUTY | Sephora',
                targetUrl: '/product/nude-obsessions-eyeshadow-palette-P450887'
            },
            currentSku: {
                alternateImages: [
                    {
                        altText: 'HUDA BEAUTY Nude Obsessions Eyeshadow Palette in Nude Medium Image 2',
                        image135: '/productimages/sku/s2288090-av-01-grid.jpg'
                    },
                    {
                        altText: 'HUDA BEAUTY Nude Obsessions Eyeshadow Palette in Nude Medium Image 3',
                        image135: '/productimages/sku/s2288090-av-02-grid.jpg'
                    }
                ],
                biExclusiveLevel: 'none',
                displayName: '2288090 Nude Medium',

                isFreeShippingSku: true,
                isLimitedEdition: false,
                isLimitedTimeOffer: false,
                isNew: false,
                isOnlineOnly: false,
                isOnlyFewLeft: false,
                isOutOfStock: false,
                isRopisEligibleSku: true,
                isSephoraExclusive: true,
                listPrice: '$29.00',
                maxPurchaseQuantity: 10,
                refinements: {
                    colorRefinements: ['Multi']
                },
                skuId: '2288090',
                skuImages: {
                    image135: '/productimages/sku/s2288090-main-grid.jpg',
                    image1500: '/productimages/sku/s2288090-main-zoom.jpg'
                },
                smallImage: '/productimages/sku/s2288090+sw-62.jpg',
                targetUrl: '/product/nude-obsessions-eyeshadow-palette-P450887',
                actionFlags: {
                    backInStockReminderStatus: 'notApplicable',
                    isAddToBasket: true,
                    isKlarnaEligible: true,
                    myListStatus: 'notAdded',
                    showFlashOnPDP: true
                },
                freeShippingType: 'rougeFreeShipping',
                isFinalSale: false,
                isInBasket: false,
                productShippingMessages: [
                    {
                        messageContext: 'product.rougeFreeShipping',
                        messageLogo: 'freeShipLogo',
                        messages: ['<span data-bi-level>Rouge</span> members enjoy <span data-ship>Free Standard Shipping</span> on every order.'],
                        type: 'message'
                    }
                ],
                url: 'http://10.187.67.25:80/v1/catalog/skus/2288090'
            },
            enableNoindexMetaTag: false,
            isHideSocial: false,
            isReverseLookupEnabled: false,
            parentCategory: {
                categoryId: 'cat60045',
                displayName: 'Eye Palettes',
                parentCategory: {
                    categoryId: 'cat130054',
                    displayName: 'Eye',
                    parentCategory: {
                        categoryId: 'cat140006',
                        displayName: 'Makeup',
                        targetUrl: '/shop/makeup-cosmetics',
                        url: '/catalog/categories/cat140006'
                    },
                    targetUrl: '/shop/eye-makeup',
                    url: '/catalog/categories/cat130054'
                },
                targetUrl: '/shop/eyeshadow-palettes',
                url: '/catalog/categories/cat60045/products?sortBy=-1&currentPage=1&content=true'
            },
            quickLookDescription: 'A mini eyeshadow palette featuring nine variations of the sexiest nude shades designed to be worn by everyone.',
            regularChildSkus: [],
            skuSelectorType: 'Image',
            swatchType: 'Image - 62',
            targetUrl: '/product/nude-obsessions-eyeshadow-palette-P450887',
            type: 'standard',
            useItWithTitle: 'Use It With',
            variationType: 'Color',
            variationTypeDisplayName: 'Color',
            onSaleChildSkus: [],
            simillarSkus: [],
            ymalSkus: [],
            recentlyViewedSkus: [],
            hoveredSku: null
        };
    });

    describe('isProductRopisUpdated', () => {
        it('should return false if the product hasn\'t been updated with ROPIS data', () => {
            expect(extraProductDetailsUtils.isProductRopisUpdated(product)).toBeFalse();
        });

        it('should return true if the product has been updated with ROPIS data', () => {
            product.pickupMessage = 'Pick';
            expect(extraProductDetailsUtils.isProductRopisUpdated(product)).toBeTrue();
        });
    });

    describe('mergeActionFlags', () => {
        it('should merge action flags of product and ropis product, NOT overwrite them', () => {
            const actionFlagsProduct = {
                backInStockReminderStatus: 'notApplicable',
                isAddToBasket: true,
                isKlarnaEligible: true,
                myListStatus: 'notAdded',
                showFlashOnPDP: true
            };

            const actionFlagsRopis = {
                availabilityStatus: 'Out of Stock',
                backInStockReminderStatus: 'notApplicable',
                isAddToPickupBasket: false,
                isKlarnaEligible: false,
                isReservationNotOffered: true
            };

            const mergedActionFlags = {
                backInStockReminderStatus: 'notApplicable',
                isAddToBasket: true,
                isKlarnaEligible: false,
                myListStatus: 'notAdded',
                showFlashOnPDP: true,
                availabilityStatus: 'Out of Stock',
                isAddToPickupBasket: false,
                isReservationNotOffered: true
            };

            extraProductDetailsUtils.mergeActionFlags(actionFlagsProduct, actionFlagsRopis);

            expect(actionFlagsProduct).toEqual(mergedActionFlags);
        });
    });

    describe('mergeChildSkus', () => {
        it(`should merge child skus info of ropis into product info, giving priority to
        ropis if some properties are different in both skus`, () => {
            const childSkus = [
                {
                    actionFlags: { availabilityStatus: 'Out of Stock' },
                    isOutOfStock: true,
                    skuId: '2288082'
                },
                {
                    actionFlags: { availabilityStatus: 'In Stock' },
                    isOutOfStock: false,
                    skuId: '2288108'
                },
                {
                    actionFlags: { availabilityStatus: 'Out of Stock' },
                    isOutOfStock: true,
                    skuId: '2288109'
                }
            ];

            const ropisChildSkus = [
                {
                    actionFlags: { availabilityStatus: 'In Stock' },
                    isOutOfStock: false,
                    skuId: '2288082'
                },
                {
                    actionFlags: { availabilityStatus: 'Out of Stock' },
                    isOutOfStock: true,
                    skuId: '2288108'
                }
            ];

            const result = [
                {
                    actionFlags: { availabilityStatus: 'In Stock' },
                    isOutOfStock: false,
                    skuId: '2288082'
                },
                {
                    actionFlags: { availabilityStatus: 'Out of Stock' },
                    isOutOfStock: true,
                    skuId: '2288108'
                },
                {
                    actionFlags: { availabilityStatus: 'Out of Stock' },
                    isOutOfStock: true,
                    skuId: '2288109'
                }
            ];

            extraProductDetailsUtils.mergeChildSkus(childSkus, ropisChildSkus);

            expect(childSkus).toEqual(result);
        });
    });

    describe('mergeCurrentSku', () => {
        it('should merge info of current sku with ropis product current sku', () => {
            const regularProduct = {
                currentSku: {
                    actionFlags: {
                        backInStockReminderStatus: 'notApplicable',
                        isAddToBasket: true,
                        isKlarnaEligible: true,
                        myListStatus: 'notAdded',
                        showFlashOnPDP: true
                    }
                }
            };

            const ropisProduct = {
                currentSku: {
                    actionFlags: {
                        availabilityStatus: 'Out of Stock',
                        backInStockReminderStatus: 'notApplicable',
                        isAddToPickupBasket: false,
                        isKlarnaEligible: false,
                        isReservationNotOffered: true
                    },
                    isFinalSale: false,
                    isInBasket: false,
                    isOutOfStock: true,
                    isRopisEligibleSku: true,
                    skuId: '2288090'
                },
                pickupMessage: 'Reservation not offered',
                productId: 'P450887',
                regularChildSkus: []
            };

            const result = {
                currentSku: {
                    actionFlags: {
                        backInStockReminderStatus: 'notApplicable',
                        isAddToBasket: true,
                        isKlarnaEligible: false,
                        myListStatus: 'notAdded',
                        showFlashOnPDP: true,
                        availabilityStatus: 'Out of Stock',
                        isAddToPickupBasket: false,
                        isReservationNotOffered: true
                    },
                    isFinalSale: false,
                    isInBasket: false,
                    isOutOfStock: true,
                    isRopisEligibleSku: true,
                    skuId: '2288090'
                },
                pickupMessage: 'Reservation not offered'
            };

            extraProductDetailsUtils.mergeCurrentSku(regularProduct, ropisProduct);

            expect(regularProduct).toEqual(result);
        });
    });

    describe('mergeCurrentSkuIntoChildSkus', () => {
        it('should merge current regular product sku into the ropis child skus', () => {
            const childSkus = [
                {
                    actionFlags: {
                        availabilityStatus: 'Out of Stock',
                        isReservationNotOffered: true
                    },
                    isOutOfStock: true,
                    isRopisEligibleSku: true,
                    skuId: '01'
                },
                {
                    actionFlags: {
                        availabilityStatus: 'Out of Stock',
                        isReservationNotOffered: true
                    },
                    isOutOfStock: false,
                    isRopisEligibleSku: true,
                    skuId: '0005'
                },
                {
                    actionFlags: {
                        availabilityStatus: 'Out of Stock',
                        isReservationNotOffered: true
                    },
                    isOutOfStock: false,
                    isRopisEligibleSku: true,
                    skuId: '02'
                }
            ];

            const currentRopisSku = {
                actionFlags: {
                    availabilityStatus: 'In Stock',
                    newActionFlag: true
                },
                isNewProperty: false,
                skuId: '0005'
            };

            const result = [
                {
                    actionFlags: {
                        availabilityStatus: 'Out of Stock',
                        isReservationNotOffered: true
                    },
                    isOutOfStock: true,
                    isRopisEligibleSku: true,
                    skuId: '01'
                },
                {
                    actionFlags: {
                        availabilityStatus: 'In Stock',
                        isReservationNotOffered: true,
                        newActionFlag: true
                    },
                    isOutOfStock: false,
                    isRopisEligibleSku: true,
                    isNewProperty: false,
                    skuId: '0005'
                },
                {
                    actionFlags: {
                        availabilityStatus: 'Out of Stock',
                        isReservationNotOffered: true
                    },
                    isOutOfStock: false,
                    isRopisEligibleSku: true,
                    skuId: '02'
                }
            ];

            extraProductDetailsUtils.mergeCurrentSkuIntoChildSkus(childSkus, currentRopisSku);
            expect(childSkus).toEqual(result);
        });
    });

    describe('findCurrentSkuInChildren', () => {
        it('should return the current sku in children skus if it\'s found', () => {
            const currentSkuId = '2288108';

            const childrenSkus = [{ skuId: '2288108' }, { skuId: '2288109' }, { skuId: '2288111' }];

            const result = { skuId: '2288108' };

            const findSku = extraProductDetailsUtils.findCurrentSkuInChildren(currentSkuId, childrenSkus);

            expect(findSku).toEqual(result);
        });
    });
});
