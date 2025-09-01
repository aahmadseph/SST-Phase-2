describe('analytics on product page load', () => {
    const productPageLoad = require('analytics/bindings/pages/product/productPageLoad').default;
    const bindingMethods = require('analytics/bindingMethods/pages/all/generalBindings').default;
    const store = require('Store').default;
    let digitalDataAttributes;

    beforeEach(() => {
        digitalDataAttributes = window.digitalData.page.attributes;
        const productPageData = {
            product: [
                {
                    productInfo: { productID: 'P427643' },
                    attributes: { world: 'Makeup' }
                }
            ]
        };

        window.digitalData = {
            ...window.digitalData,
            ...productPageData
        };

        spyOn(store, 'getState').and.returnValue({
            page: {
                product: {
                    currentSku: {}
                }
            }
        });
        spyOn(bindingMethods, 'getSephoraPageName').and.returnValue('product:p427643:makeup:*');
    });

    describe('general', () => {
        beforeEach(() => {
            productPageLoad();
            global.braze = { logCustomEvent: jasmine.createSpy() };
        });

        it('should not set prop4', () => {
            expect(digitalDataAttributes.search.searchTerm).toEqual('');
        });

        it('should not set prop5', () => {
            expect(digitalDataAttributes.search.numberOfResults).toEqual('');
        });
    });
});
