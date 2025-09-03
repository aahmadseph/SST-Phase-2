describe('Actions', () => {
    let Actions;
    let PageTemplateType;
    const TEMPLATE_TYPES = {
        SET_NTH_CATEGORY: 'SET_NTH_CATEGORY',
        SET_NTH_BRAND: 'SET_NTH_BRAND'
    };

    beforeEach(() => {
        Actions = require('actions/CategoryActions').default;
        PageTemplateType = require('constants/PageTemplateType').default;
    });

    describe('setNthCatalogData', () => {
        it('should set template type to NthCategory', () => {
            const type = PageTemplateType.NthCategory;
            const data = { someData: 'someData' };
            const requestOptions = { options: 'someOptions' };
            const displayOptions = { displayOptions: 'someDisplay' };
            const nthCatalogData = Actions.setNthCatalogData(data, type, requestOptions, displayOptions);
            expect(nthCatalogData).toEqual({
                type: TEMPLATE_TYPES.SET_NTH_CATEGORY,
                payload: {
                    data,
                    requestOptions,
                    displayOptions
                }
            });
        });

        it('should set template type to NthBrands', () => {
            const type = PageTemplateType.BrandNthCategory;
            const data = { someData: 'someData' };
            const requestOptions = { options: 'someOptions' };
            const displayOptions = { displayOptions: 'someDisplay' };
            const nthCatalogData = Actions.setNthCatalogData(data, type, requestOptions, displayOptions);
            expect(nthCatalogData).toEqual({
                type: TEMPLATE_TYPES.SET_NTH_BRAND,
                payload: {
                    data,
                    requestOptions,
                    displayOptions
                }
            });
        });
    });
});
