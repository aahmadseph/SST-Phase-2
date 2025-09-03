const { objectContaining } = jasmine;

describe('recommendationUtils', () => {
    let recommendationUtils;
    beforeAll(async() => {
        recommendationUtils = await import('#server/services/apiOrchestration/recommendation/utils/recommendationUtils.mjs');
    });

    describe('Test overrideLocAndCh', () => {
        it('with no params, return default channel, language and country', () => {
            const defaultOutput = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh();

            expect(result).toEqual(defaultOutput);
        });

        it('with ch=web and loc=en-US params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: 'web',
                    loc: 'en-US'
                }
            };

            const expected = {
                channel: 'web',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with invalid ch and loc=fr-CA params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: 'jpg',
                    loc: 'fr-CA'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'fr',
                country: 'CA'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with ch=web and invalid loc params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: 'web',
                    loc: 'es-MX'
                }
            };

            const expected = {
                channel: 'web',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with invalid ch and loc params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: '123',
                    loc: '456'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with missed ch and loc=en-CA params', () => {
            const apiOptions = {
                parseQuery: {
                    loc: 'en-CA'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'CA'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with ch=androidApp and missed loc params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: 'androidApp'
                }
            };

            const expected = {
                channel: 'androidApp',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with missed ch and incorrect loc params', () => {
            const apiOptions = {
                parseQuery: {
                    loc: '123'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with incorrect ch and missed loc params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: 'androidApp2'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with null params', () => {
            const apiOptions = null;

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with empty ch and loc params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: '',
                    loc: ''
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with loc partially valid', () => {
            const apiOptions = {
                parseQuery: {
                    loc: 'en-INVALID'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with loc containing only language code', () => {
            const apiOptions = {
                parseQuery: {
                    loc: 'fr'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with ch=WEB and loc=EN-us (mixed case)', () => {
            const apiOptions = {
                parseQuery: {
                    ch: 'WEB',
                    loc: 'EN-us'
                }
            };

            const expected = {
                channel: 'rwd',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

        it('with additional unused query params', () => {
            const apiOptions = {
                parseQuery: {
                    ch: 'web',
                    loc: 'en-US',
                    extraParam: 'unused'
                }
            };

            const expected = {
                channel: 'web',
                language: 'en',
                country: 'US'
            };

            const result = recommendationUtils.overrideLocAndCh(apiOptions);

            expect(result).toEqual(objectContaining(expected));
        });

    });

    describe('includesPreferredSku', () => {
        it('with empty recoProducts list', () => {
            const result = recommendationUtils.includesPreferredSku([], '123');

            expect(result).toBe(false);
        });

        it('with undefined recoProducts list', () => {
            const result = recommendationUtils.includesPreferredSku(undefined, '123');

            expect(result).toBe(false);
        });

        it('with recoProducts list but no currentSku field', () => {
            const recoProducts = [
                {
                    id: '1',
                    name: 'Product 1'
                },
                {
                    id: '2',
                    name: 'Product 2'
                }
            ];
            const result = recommendationUtils.includesPreferredSku(recoProducts, '123');

            expect(result).toBe(false);
        });

        it('with recoProducts list and no matching skuId', () => {
            const recoProducts = [
                {
                    id: '1',
                    currentSku: { skuId: '101' }
                },
                {
                    id: '2',
                    currentSku: { skuId: '102' }
                }
            ];
            const result = recommendationUtils.includesPreferredSku(recoProducts, '123');

            expect(result).toBe(false);
        });


        it('with recoProducts list and matching skuId', () => {
            const recoProducts = [
                {
                    id: '1',
                    currentSku: { skuId: '101' }
                },
                {
                    id: '2',
                    currentSku: { skuId: '123' }
                }
            ];
            const result = recommendationUtils.includesPreferredSku(recoProducts, '123');

            expect(result).toBe(true);
        });

        it('with recoProducts having undefined currentSku', () => {
            const recoProducts = [
                {
                    id: '1',
                    currentSku: undefined
                },
                {
                    id: '2',
                    currentSku: { skuId: '123' }
                }
            ];
            const result = recommendationUtils.includesPreferredSku(recoProducts, '123');

            expect(result).toBe(true);
        });

        it('with recoProducts having null values for currentSku', () => {
            const recoProducts = [
                {
                    id: '1',
                    currentSku: null
                },
                {
                    id: '2',
                    currentSku: { skuId: '123' }
                }
            ];
            const result = recommendationUtils.includesPreferredSku(recoProducts, '123');

            expect(result).toBe(true);
        });

        it('with recoProducts list containing products but none have skuId', () => {
            const recoProducts = [
                {
                    id: '1',
                    currentSku: { skuId: '111' }
                },
                {
                    id: '2',
                    currentSku: { skuId: '222' }
                }
            ];
            const result = recommendationUtils.includesPreferredSku(recoProducts, '123');

            expect(result).toBe(false);
        });

    });

    describe('buildResponse', () => {
        it('with empty details and properties', () => {
            const result = recommendationUtils.buildResponse({}, []);

            expect(result).toEqual({});
        });

        it('with non-empty details and empty properties', () => {
            const details = {
                name: 'John',
                age: 30
            };
            const result = recommendationUtils.buildResponse(details, []);

            expect(result).toEqual({});
        });

        it('with empty details and non-empty properties', () => {
            const properties = ['name', 'age'];
            const result = recommendationUtils.buildResponse({}, properties);

            expect(result).toEqual({});
        });

        it('with matching details and properties', () => {
            const details = {
                name: 'John',
                age: 30
            };
            const properties = ['name', 'age'];
            const expected = {
                name: 'John',
                age: 30
            };
            const result = recommendationUtils.buildResponse(details, properties);

            expect(result).toEqual(expected);
        });

        it('with partial matching details and properties', () => {
            const details = {
                name: 'John',
                age: 30
            };
            const properties = ['name'];
            const expected = { name: 'John' };
            const result = recommendationUtils.buildResponse(details, properties);

            expect(result).toEqual(expected);
        });

        it('with non-matching details and properties', () => {
            const details = {
                name: 'John',
                age: 30
            };
            const properties = ['height', 'weight'];
            const result = recommendationUtils.buildResponse(details, properties);

            expect(result).toEqual({});
        });


        it('with details containing undefined values', () => {
            const details = {
                name: 'John',
                age: undefined
            };
            const properties = ['name', 'age'];
            const expected = {
                name: 'John',
                age: undefined
            };
            const result = recommendationUtils.buildResponse(details, properties);

            expect(result).toEqual(expected);
        });

        it('with details containing null or falsy values', () => {
            const details = {
                name: 'John',
                age: null,
                active: false
            };
            const properties = ['name', 'age', 'active'];
            const expected = {
                name: 'John',
                age: null,
                active: false
            };
            const result = recommendationUtils.buildResponse(details, properties);

            expect(result).toEqual(expected);
        });

        it('with nested object in details', () => {
            const details = {
                name: 'John',
                address: { city: 'New York' }
            };
            const properties = ['name', 'address'];
            const expected = {
                name: 'John',
                address: { city: 'New York' }
            };
            const result = recommendationUtils.buildResponse(details, properties);

            expect(result).toEqual(expected);
        });

    });

    describe('mergeStockAvailabilityWithProductSkus', () => {
        let productDetails;
        let stockAvailability;

        beforeEach(() => {
            productDetails = {
                currentSku: {
                    skuId: '123',
                    name: 'Product A',
                    actionFlags: 'oldFlag' // Existing action flag
                },
                regularChildSkus: [{
                    skuId: 'child1',
                    name: 'Child 1',
                    actionFlags: 'oldChildFlag' // Existing action flag
                }]
            };

            stockAvailability = {
                currentSku: {
                    skuId: '123',
                    stock: 10,
                    isOutOfStock: false,
                    actionFlags: 'someFlag' // New action flag
                },
                regularChildSkus: [
                    {
                        skuId: 'child1',
                        stock: 5,
                        isOutOfStock: false,
                        actionFlags: 'childFlag1' // New action flag
                    },
                    {
                        skuId: 'child2',
                        stock: 0,
                        isOutOfStock: true
                    }
                ]
            };
        });

        it('with no stock availability (default OOS)', () => {
            const result = recommendationUtils.mergeStockAvailabilityWithProductSkus(productDetails, null);

            expect(result).toEqual(objectContaining({
                ...productDetails,
                currentSku: {
                    ...productDetails.currentSku,
                    isOutOfStock: true
                },
                regularChildSkus: [{
                    ...productDetails.regularChildSkus[0],
                    isOutOfStock: true
                }]
            }));
        });

        it('with stock availability provided (update stock info)', () => {
            const result = recommendationUtils.mergeStockAvailabilityWithProductSkus(productDetails, stockAvailability);

            expect(result).toEqual(objectContaining({
                ...productDetails,
                currentSku: {
                    ...productDetails.currentSku,
                    isOutOfStock: false,
                    stock: 10,
                    actionFlags: 'someFlag' // Include actionFlags from stockAvailability
                },
                regularChildSkus: [{
                    ...productDetails.regularChildSkus[0],
                    stock: 5,
                    isOutOfStock: false,
                    actionFlags: 'childFlag1' // Include actionFlags from stockAvailability
                }]
            }));
        });

        it('with no matching SKUs in stockAvailability (keep OOS)', () => {
            stockAvailability = {
                currentSku: {
                    skuId: '999',
                    stock: 0,
                    isOutOfStock: true
                },
                regularChildSkus: [{
                    skuId: '999',
                    stock: 0,
                    isOutOfStock: true
                }]
            };
            const result = recommendationUtils.mergeStockAvailabilityWithProductSkus(productDetails, stockAvailability);

            expect(result).toEqual(objectContaining({
                ...productDetails,
                currentSku: {
                    ...productDetails.currentSku,
                    isOutOfStock: true
                },
                regularChildSkus: [{
                    ...productDetails.regularChildSkus[0],
                    isOutOfStock: true
                }]
            }));
        });
    });

    describe('mergeProductDetailsWithRecoProducts', () => {
        let productDetails;
        let recoProducts;
        const selectedProductId = '123';

        beforeEach(() => {
            productDetails = {
                currentSku: {
                    skuId: 'sku-123',
                    name: 'Product A'
                },
                otherDetails: 'Some other product details'
            };

            recoProducts = [
                {
                    productId: '123',
                    name: 'Recommended Product A'
                },
                {
                    productId: '456',
                    name: 'Recommended Product B'
                },
                {
                    productId: '789',
                    name: 'Recommended Product C'
                }
            ];
        });

        it('should update the recommended product with product details when found', () => {
            const result = recommendationUtils.mergeProductDetailsWithRecoProducts(productDetails, recoProducts, selectedProductId);

            expect(result).toEqual([
                {
                    productId: '123',
                    name: 'Recommended Product A',
                    currentSku: productDetails.currentSku,
                    productPage: { ...productDetails }
                },
                recoProducts[1], // No changes to the second reco product
                recoProducts[2] // No changes to the third reco product
            ]);
        });

        it('should not update any recommended products when the selected product ID is not found', () => {
            const result = recommendationUtils.mergeProductDetailsWithRecoProducts(productDetails, recoProducts, '000');

            expect(result).toEqual(recoProducts); // No change, should return the original recoProducts
        });

        it('should handle an empty recoProducts array', () => {
            const result = recommendationUtils.mergeProductDetailsWithRecoProducts(productDetails, [], selectedProductId);

            expect(result).toEqual([]); // Should return an empty array
        });

        it('should not mutate the original recoProducts array', () => {
            const originalRecoProducts = [...recoProducts];
            recommendationUtils.mergeProductDetailsWithRecoProducts(productDetails, recoProducts, selectedProductId);

            expect(recoProducts).toEqual(originalRecoProducts); // Ensure original recoProducts is unchanged
        });

        it('should retain other properties of the recommended product when updating', () => {
            const newRecoProducts = [
                {
                    productId: '123',
                    name: 'Recommended Product A',
                    extraInfo: 'Extra info'
                },
                {
                    productId: '456',
                    name: 'Recommended Product B'
                }
            ];

            const result = recommendationUtils.mergeProductDetailsWithRecoProducts(productDetails, newRecoProducts, selectedProductId);

            expect(result).toEqual([
                {
                    productId: '123',
                    name: 'Recommended Product A',
                    extraInfo: 'Extra info', // Retained extra info
                    currentSku: productDetails.currentSku,
                    productPage: { ...productDetails }
                },
                newRecoProducts[1] // No changes to the second reco product
            ]);
        });
    });
});
