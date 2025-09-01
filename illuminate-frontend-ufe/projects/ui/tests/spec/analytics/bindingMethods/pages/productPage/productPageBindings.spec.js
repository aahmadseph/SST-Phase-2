// eslint-disable-next-line object-curly-newline
const {
    COMPONENT_TITLE: { PRODUCTS_GRID, SKUGRID }
} = require('analytics/constants').default;

describe('Product Page Binding Methods', () => {
    const bindingMethods = require('analytics/bindingMethods/pages/productPage/productPageBindings').default;
    const localeUtils = require('utils/LanguageLocale').default;
    const skuUtils = require('utils/Sku').default;
    let product;
    let productsVariable;
    let previousPageData;
    let isUsStub;

    describe('populatePrimaryProductObject()', () => {
        beforeEach(() => {
            isUsStub = spyOn(localeUtils, 'isUS');
            isUsStub.and.returnValue(true);
            product = {
                productDetails: {
                    productId: 'P431741',
                    displayName: 'Sephora: Sol de Janeiro : Glow Oils : Body Lotions & Body Oils',
                    fullSiteProductUrl: '/product/',
                    shortDescription: 'short description'
                },
                currentSku: {
                    skuId: '1839885',
                    listPrice: '$30.00',
                    salePrice: '$15.00',
                    valuePrice: '($50.00 value)',
                    isNew: true,
                    isSephoraExclusive: false,
                    isLimitedEdition: false,
                    isOnlineOnly: true,
                    isOnlyFewLeft: true,
                    isAppExclusive: false,
                    isFirstAccess: true,
                    isLimitedTimeOffer: true,
                    skuImages: { image250: 'path/to/image' }
                }
            };
        });

        it('should set sale price in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.salePrice).toBe('$15.00');
        });

        it('should set original price in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.originalPrice).toBe('$30.00');
        });

        it('should set value price in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.valuePrice).toBe('$50.00');
        });

        it('should set price in primary product object regardless of locale', () => {
            isUsStub.and.returnValue(false);
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.originalPrice).toBe('$30.00');
        });

        it('should set isNew flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isNew).toBe(true);
        });

        it('should set isSephoraExclusive flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isSephoraExclusive).toBe(false);
        });

        it('should set isLimitedEdition flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isLimitedEdition).toBe(false);
        });

        it('should set isOnlineOnly flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isOnlineOnly).toBe(true);
        });

        it('should set isOnlyFewLeft flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isOnlyFewLeft).toBe(true);
        });

        it('should set isAppExclusive flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isAppExclusive).toBe(false);
        });

        it('should set isFirstAccess flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isFirstAccess).toBe(true);
        });

        it('should set isLimitedTimeOffer flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isLimitedTimeOffer).toBe(true);
        });

        it('should set isNew flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isNew).toBe(true);
        });

        it('should set isSephoraExclusive flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isSephoraExclusive).toBe(false);
        });

        it('should set isLimitedEdition flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isLimitedEdition).toBe(false);
        });

        it('should set isOnlineOnly flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isOnlineOnly).toBe(true);
        });

        it('should set isOnlyFewLeft flag in primary product object for bluecore', () => {
            bindingMethods.populatePrimaryProductObject(product);
            expect(window.digitalData.product[0].attributes.isOnlyFewLeft).toBe(true);
        });
    });

    describe('getProductStrings()', () => {
        beforeEach(() => {
            product = {
                attributes: {
                    skuId: '1839885',
                    customizableSetType: '1'
                }
            };

            previousPageData = window.digitalData.page.attributes.previousPageData;
        });

        it('should set evar26 to be the skuid', () => {
            productsVariable = bindingMethods.getProductStrings(product);
            const evar26 = productsVariable.split(';').pop().split('|')[0].split('=')[1];
            expect(evar26).toBe('1839885');
        });

        it('should set evar37 to be the customizableSetType', () => {
            productsVariable = bindingMethods.getProductStrings(product);
            const evar37 = productsVariable.split(';').pop().split('|')[1].split('=')[1];
            expect(evar37).toBe('1');
        });

        describe('evar52 variable', () => {
            it('should not set variable if product is Rouge Reward Card', () => {
                productsVariable = bindingMethods.getProductStrings(product, {
                    biExclusiveLevel: 'Rouge',
                    rewardSubType: 'Reward_Card'
                });
                expect(productsVariable).toEqual(';1839885;;;;evar26=1839885|evar37=1');
            });

            it('should not set variable if there is no internal campaign', () => {
                productsVariable = bindingMethods.getProductStrings(product);
                expect(productsVariable).toEqual(';1839885;;;;evar26=1839885|evar37=1');
            });

            it('should contain the correct type if it is not an external rec', () => {
                window.digitalData.page.attributes.internalCampaign = 'bestsellers:p377873:product';
                previousPageData.recInfo = { isExternalRec: '' };
                productsVariable = bindingMethods.getProductStrings(product);
                const evar52 = productsVariable.split(';').pop().split('|')[2].split('=')[1];
                const externalRec = evar52.split('_')[0];
                expect(externalRec).toEqual('sephora');
            });

            it('should contain the previous page type', () => {
                window.digitalData.page.attributes.internalCampaign = 'bestsellers:p377873:product';
                previousPageData.pageType = 'home page';
                productsVariable = bindingMethods.getProductStrings(product);
                const evar52 = productsVariable.split(';').pop().split('|')[2].split('=')[1];
                expect(evar52).toEqual('sephora_home page_n/a_n/a');
            });

            it('should contain the correct component name', () => {
                // Arrange
                window.digitalData.page.attributes.internalCampaign = 'bestsellers:p377873:product';
                const componentName = 'bestsellers_us_d_052918productcarousel';
                previousPageData.pageType = 'home page';
                previousPageData.recInfo.componentTitle = componentName;

                // Act
                productsVariable = bindingMethods.getProductStrings(product);

                // Assert
                const evar52 = productsVariable.split(';').pop().split('|')[2].split('=')[1];
                expect(evar52).toEqual(`sephora_home page_${componentName}_n/a`);
            });

            it('should contain "skugrid" when the component title is "products grid"', () => {
                // Arrange
                window.digitalData.page.attributes.internalCampaign = 'bestsellers:p377873:product';
                previousPageData.recInfo.componentTitle = PRODUCTS_GRID;

                // Act
                productsVariable = bindingMethods.getProductStrings(product);

                // Assert
                expect(productsVariable).toContain(SKUGRID);
            });
        });

        it('should contain skuId, evar26, evar37, evar52', () => {
            window.digitalData.page.attributes.internalCampaign = 'bestsellers:p377873:product';
            productsVariable = bindingMethods.getProductStrings(product);
            expect(productsVariable).toBe(';1839885;;;;evar26=1839885|evar37=1|evar52=sephora_n/a_n/a_n/a');
        });
    });

    describe('getProductWorld()', () => {
        beforeEach(() => {
            product = {
                parentCategory: { displayName: 'parentCategoryDisplayName' },
                displayName: 'display_name'
            };
        });

        it('should return n/a when parentCategory is undefined and product is a BI reward', () => {
            spyOn(skuUtils, 'isBiReward').and.returnValue(true);
            product.parentCategory = undefined;
            product.currentSku = { productName: 'PRODUCT NAME' };
            expect(bindingMethods.getProductWorld(product)).toEqual('n/a');
        });

        it('should return the displayName when parentCategory is undefined and product is not a BI reward', () => {
            product.parentCategory = undefined;
            expect(bindingMethods.getProductWorld(product)).toEqual(product.displayName);
        });

        it('should allways return value in lower case', () => {
            // Arrange
            product = { displayName: 'DisplayName' };

            // Act
            const productWorld = bindingMethods.getProductWorld(product);

            // Assert
            expect(productWorld).toEqual(product.displayName.toLowerCase());
        });

        it('should return empty string when displayName is not defined', () => {
            // Arrange
            product = {};

            // Act
            const productWorld = bindingMethods.getProductWorld(product);

            // Assert
            expect(productWorld).toEqual('');
        });
    });
});
