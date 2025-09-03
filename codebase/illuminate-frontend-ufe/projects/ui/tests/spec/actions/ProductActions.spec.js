const Actions = require('actions/ProductActions').default;

describe('Product actions', () => {
    let result;

    describe('function isNewPage', () => {
        it('should return "true" when user click on another product', () => {
            // Arrange
            const newLocation = {
                queryParams: '',
                path: 'https://local.sephora.com/product/bleu-de-chanel-P270302'
            };
            const previousLocation = {
                queryParams: '',
                path: 'https://local.sephora.com/product/chance-eau-tendre-P258612'
            };

            // Act
            const newPage = Actions.isNewPage({
                newLocation,
                previousLocation
            });

            // Assert
            expect(newPage).toBeTruthy();
        });

        it('should return "false" when user click on another SKU', () => {
            // Arrange
            const newLocation = {
                queryParams: 'skuId=1284710',
                path: 'https://local.sephora.com/product/bleu-de-chanel-P270302'
            };
            const previousLocation = {
                queryParams: 'skuId=1284728',
                path: 'https://local.sephora.com/product/bleu-de-chanel-P270302'
            };

            // Act
            const newPage = Actions.isNewPage({
                newLocation,
                previousLocation
            });

            // Assert
            expect(newPage).toBeFalsy();
        });
    });

    describe('updateCurrentProduct', () => {
        const currentProduct = { myCurrentProductKey: 'my current product value' };

        beforeEach(() => {
            result = Actions.updateCurrentProduct({});
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.UPDATE_CURRENT_PRODUCT);
        });

        it('should update current product', () => {
            result = Actions.updateCurrentProduct(currentProduct);
            expect(result.currentProduct).toEqual(currentProduct);
        });
    });

    describe('updateCurrentUserSpecificProduct', () => {
        const currentProduct = { myKey: 'my value' };

        beforeEach(() => {
            result = Actions.updateCurrentUserSpecificProduct({});
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.UPDATE_CURRENT_PRODUCT_USER_SPECIFIC);
        });

        it('should update current product and user data', () => {
            result = Actions.updateCurrentUserSpecificProduct(currentProduct);
            expect(result.payload.currentProductUserSpecificDetails).toEqual(currentProduct);
        });
    });

    describe('updateSkuInCurrentProduct function', () => {
        const currentSkuInProduct = { myCurrentSku: 'my current sku' };

        it('should return the action type', () => {
            result = Actions.updateSkuInCurrentProduct({}, {});
            expect(result.type).toEqual(Actions.TYPES.UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT);
        });

        it('should update the current sku in the product', () => {
            result = Actions.updateSkuInCurrentProduct(currentSkuInProduct, {});
            expect(result.payload.currentSku).toEqual(currentSkuInProduct);
        });
    });

    describe('toggleCustomSets', () => {
        beforeEach(() => {
            result = Actions.toggleCustomSets(true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.TOGGLE_CUSTOM_SETS);
        });

        it('should open custom sets', () => {
            expect(result.isOpen).toBeTruthy();
        });

        it('should close custom sets', () => {
            result = Actions.toggleCustomSets(false);
            expect(result.isOpen).toBeFalsy();
        });
    });

    describe('applyReviewFilters', () => {
        const filters = ['', ''];

        beforeEach(() => {
            result = Actions.applyReviewFilters(filters, true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.REVIEW_FILTERS_APPLIED);
        });

        it('should set the filters', () => {
            expect(result.filters).toEqual(filters);
        });

        it('should apply as true', () => {
            expect(result.apply).toBeTruthy();
        });
    });

    describe('selectSortOption', () => {
        const code = 'my code';
        const name = 'my name';

        beforeEach(() => {
            result = Actions.selectSortOption(code, name);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SELECT_SORT_OPTION);
        });

        it('should set the sort option', () => {
            expect(result.sortOption).toEqual({
                code,
                name
            });
        });
    });

    describe('selectFilterOption', () => {
        const code = 'my code';
        const name = 'my name';

        beforeEach(() => {
            result = Actions.selectFilterOption(code, name);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SELECT_FILTER_OPTION);
        });

        it('should set the filter option', () => {
            expect(result.filterOption).toEqual({
                code,
                name
            });
        });
    });

    describe('purchasesFilterOptions', () => {
        const filterOptions = [{}, {}];

        beforeEach(() => {
            result = Actions.purchasesFilterOptions(filterOptions);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.PURCHASES_FILTER_OPTIONS);
        });

        it('should set filter options', () => {
            expect(result.filterOptions).toEqual(filterOptions);
        });
    });
});
