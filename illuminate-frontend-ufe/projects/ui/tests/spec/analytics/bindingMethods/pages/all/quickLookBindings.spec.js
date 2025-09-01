describe('quickLookBindings', () => {
    let quickLookBindings;
    let data;
    let internalCampaignString;
    let quickLookFeatureString;
    let quicklookPageName;
    let productPageBindings;
    let testTargetUtils;
    let skuUtils;

    beforeEach(() => {
        testTargetUtils = require('utils/TestTarget').default;
        productPageBindings = require('analytics/bindingMethods/pages/productPage/productPageBindings').default;
        quickLookBindings = require('analytics/bindingMethods/pages/all/quickLookBindings').default;
        skuUtils = require('utils/Sku').default;
        data = {
            eventName: 'quickLookLoad',
            product: {
                currentSku: {
                    skuId: '1960004',
                    isOnlyFewLeft: false,
                    skuImages: { image250: '/productimages/sku/s1960004-main-hero.jpg' }
                },
                productDetails: {
                    productId: 'P370205',
                    shortDescription: '',
                    displayName: 'display name'
                },
                shortDescription: '',
                skuSelectorType: 'None',
                displayName: 'standard'
            },
            sku: {
                imageSize: 97,
                imagePath: '/productimages/sku/s1706597-main-grid.jpg',
                variationValue: 'variationValue',
                maxSampleQty: '3',
                skuId: '1960004'
            },
            previousPageName: 'basket:basket:n/a:*'
        };
    });

    describe('getQLInternalCampaign', () => {
        it('should return the string with n/a if there is no root container name', () => {
            internalCampaignString = ('n/a' + ':' + data.product.productDetails.productId + ':quicklook').toLowerCase();

            expect(quickLookBindings.getQLInternalCampaign(data)).toEqual(internalCampaignString);
        });

        it('should return the string with n/a if there is no root container name', () => {
            data.rootContainerName = 'skuGrid_test';
            internalCampaignString = (data.rootContainerName + ':' + data.product.productDetails.productId + ':quicklook').toLowerCase();

            expect(quickLookBindings.getQLInternalCampaign(data)).toEqual(internalCampaignString);
        });
    });

    describe('getQuickLookFeatureString', () => {
        it('should return the string with only a few left if property is true', () => {
            data.product.currentSku.isOnlyFewLeft = true;
            quickLookFeatureString = 'ql:only a few left';

            expect(quickLookBindings.getQuickLookFeatureString(data.product)).toEqual(quickLookFeatureString);
        });

        it('should return the string with swatch if skuSelectorType is different than none', () => {
            data.product.skuSelectorType = 'Image';
            quickLookFeatureString = 'ql:swatch';

            expect(quickLookBindings.getQuickLookFeatureString(data.product)).toEqual(quickLookFeatureString);
        });

        it('should return the string with swatch and only a few left if both values present', () => {
            data.product.skuSelectorType = 'Image';
            data.product.currentSku.isOnlyFewLeft = true;
            quickLookFeatureString = 'ql:only a few left,ql:swatch';

            expect(quickLookBindings.getQuickLookFeatureString(data.product)).toEqual(quickLookFeatureString);
        });
    });

    describe('getQuickLookPageName', () => {
        it('should return the correct product name for a standard product', () => {
            quicklookPageName = (
                'quicklook:' +
                data.product.productDetails.productId +
                ':n/a:*pname=' +
                data.product.productDetails.displayName
            ).toLowerCase();

            expect(quickLookBindings.getQuickLookPageName(data)).toEqual(quicklookPageName);
        });

        it('should return the correct product name when the product is a reward', () => {
            data.product.currentSku.rewardsInfo = { productName: 'reward' };
            quicklookPageName = (
                'quicklook:' +
                data.product.productDetails.productId +
                ':n/a:*pname=' +
                data.product.currentSku.rewardsInfo.productName
            ).toLowerCase();

            expect(quickLookBindings.getQuickLookPageName(data)).toEqual(quicklookPageName);
        });

        describe('should return the correct product name when the product is a sample', () => {
            beforeEach(() => {
                spyOn(skuUtils, 'isSample').and.returnValue(true);
            });

            it('and the product.productDetails.brand exists', () => {
                data.product.productDetails.brand = { displayName: 'sample' };
                quicklookPageName = (
                    'quicklook:' +
                    data.product.productDetails.productId +
                    ':n/a:*pname=' +
                    data.product.productDetails.brand.displayName
                ).toLowerCase();

                expect(quickLookBindings.getQuickLookPageName(data)).toEqual(quicklookPageName);
            });

            it('and the product.productDetails.brand does not exist', () => {
                quicklookPageName = ('quicklook:' + data.product.productDetails.productId + ':n/a:*pname=' + data.sku.variationValue).toLowerCase();

                expect(quickLookBindings.getQuickLookPageName(data)).toEqual(quicklookPageName);
            });
        });
    });

    describe('getQuickLookWorld', () => {
        it('should return "bi-rewards" when product has rewardsInfo', () => {
            data.rewardsInfo = { productName: 'reward' };
            expect(quickLookBindings.getQuickLookWorld(data)).toEqual('bi-rewards');
        });

        it('should return world from data when its passed as a param', () => {
            data.world = 'makeup';
            expect(quickLookBindings.getQuickLookWorld(data)).toEqual('makeup');
        });

        it('should return top category world from data when its passed as a param', () => {
            data.sku = { topCategory: 'hair' };
            expect(quickLookBindings.getQuickLookWorld(data)).toEqual('hair');
        });

        it('should return parent category name from data when its passed as a param', () => {
            data.product = { parentCategory: { displayName: 'skincare' } };
            expect(quickLookBindings.getQuickLookWorld(data)).toEqual('skincare');
        });
    });

    describe('buildProductString', () => {
        it('should pass productStringContainerName parameter as container name', () => {
            // Arrange
            data = {
                sku: { skuId: 'skuId' },
                previousPageType: 'prevPage',
                productStringContainerName: 'productStringContainerName'
            };
            spyOn(testTargetUtils, 'updateDigitalProductObject');
            spyOn(productPageBindings, 'getCustomizableSetsKey').and.returnValue('customSets');

            // Act
            const productString = quickLookBindings.buildProductString(data);

            // Assert
            expect(productString).toEqual(';skuid;;;;evar26=skuid|evar37=customsets|' + 'evar52=sephora_prevpage_productstringcontainername_n/a');
        });
    });
});
