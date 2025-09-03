const CatalogUtils = require('utils/Catalog').default;
const PageTemplateType = require('constants/PageTemplateType').default;

describe('Catalog utils', () => {
    describe('createRequestOptions', () => {
        let displayOptions;
        let restParams;
        let location;

        beforeEach(() => {
            displayOptions = {};
            restParams = { responseSource: 'NLP' };
            location = {
                path: 'some/Path',
                queryParams: { ref: '' }
            };
        });

        it('should return requestOptions.pl as undefined if displayOptions.pl is null', () => {
            displayOptions.pl = null;

            const requestOptions = CatalogUtils.createRequestOptions(displayOptions, restParams);

            expect(requestOptions.pl).toBeUndefined();
        });

        it('should return requestOptions.ph as undefined if displayOptions.ph is null', () => {
            displayOptions.ph = null;

            const requestOptions = CatalogUtils.createRequestOptions(displayOptions, restParams);

            expect(requestOptions.ph).toBeUndefined();
        });

        it('should return requestOptions.node as undefined if displayOptions.node is null', () => {
            displayOptions.node = null;

            const requestOptions = CatalogUtils.createRequestOptions(displayOptions, restParams);

            expect(requestOptions.node).toBeUndefined();
        });

        it('should return valid param for BEST_SELLING', () => {
            location.queryParams.sortBy = ['BEST_SELLING'];
            const requestOptions = CatalogUtils.createRequestOptions(displayOptions, restParams, location);

            expect(requestOptions.sortBy).toEqual('P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0');
        });

        it('should return valid pl api param based on query', () => {
            const expected = '100';
            location.queryParams.pl = [expected];
            const requestOptions = CatalogUtils.createRequestOptions(displayOptions, restParams, location);

            expect(requestOptions.pl).toEqual(expected);
        });

        it('should return valid ph api param based on query', () => {
            const expected = '100';
            location.queryParams.ph = [expected];
            const requestOptions = CatalogUtils.createRequestOptions(displayOptions, restParams, location);

            expect(requestOptions.ph).toEqual(expected);
        });

        it('should return valid ptype api param based on query', () => {
            const expected = 'manual';
            location.queryParams.ptype = [expected];
            const requestOptions = CatalogUtils.createRequestOptions(displayOptions, restParams, location);

            expect(requestOptions.ptype).toEqual(expected);
        });
    });

    describe('getOptionsFromLocation', () => {
        let location;
        let categoriesForSearching;
        let restParams;

        beforeEach(() => {
            location = {
                path: 'some/Path',
                queryParams: { ref: '' }
            };
            categoriesForSearching = {};
            restParams = {
                template: PageTemplateType.NthCategory,
                responseSource: 'NLP'
            };
        });

        it('should return defult currentPage 1 if it is not specified by params', () => {
            location.queryParams.currentPage = ['someQueryParam'];
            const catalogOptions = CatalogUtils.getOptionsFromLocation(location, categoriesForSearching, restParams);

            expect(catalogOptions.displayOptions.currentPage).toEqual(location.queryParams.currentPage[0]);
        });

        it('should return currentPage based on a given currentPage from params', () => {
            const catalogOptions = CatalogUtils.getOptionsFromLocation(location, categoriesForSearching, restParams);

            expect(catalogOptions.displayOptions.currentPage).toEqual(1);
        });
    });

    describe('getCatalogName', () => {
        const catalogName = 'catalogName';
        const shop = '/shop/';

        it('should return the correct value', () => {
            const path = `/shop/${catalogName}`;
            expect(CatalogUtils.getCatalogName(path, shop)).toEqual(catalogName);
        });

        it('should return the correct value for CA', () => {
            const path = `/ca/en/shop/${catalogName}`;
            expect(CatalogUtils.getCatalogName(path, shop)).toEqual(catalogName);
        });

        it('should return the correct value if there are other elements after catalog name', () => {
            const path = `/shop/${catalogName}/categorySeoName`;
            expect(CatalogUtils.getCatalogName(path, shop)).toEqual(`${catalogName}/categorySeoName`);
        });

        it('should return null if "shop" does not exist', () => {
            const path = `/somethingElse/${catalogName}`;
            expect(CatalogUtils.getCatalogName(path, shop)).toEqual(null);
        });

        it('should return null if it does not follow shop', () => {
            const path = `/${catalogName}/shop`;
            expect(CatalogUtils.getCatalogName(path, shop)).toEqual(null);
        });
    });

    describe('mergeFulfillOptions', () => {
        const serverData = {
            refinements: [
                {
                    type: 'checkboxes',
                    values: [3, 4]
                }
            ]
        };

        const clientData = {
            refinements: [
                {
                    type: 'checkboxesWithDropDown',
                    values: [1, 2]
                }
            ]
        };

        it('should return client side refinements + server side refinements in the same array', () => {
            const mergedData = {
                refinements: [
                    {
                        type: 'checkboxesWithDropDown',
                        values: [1, 2]
                    },
                    {
                        type: 'checkboxes',
                        values: [3, 4]
                    }
                ]
            };
            expect(CatalogUtils.mergeFulfillOptions(serverData, clientData)).toEqual(mergedData);
        });
    });
});
