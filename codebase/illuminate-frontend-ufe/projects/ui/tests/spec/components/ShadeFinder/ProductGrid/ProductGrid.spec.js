/* eslint-disable no-unused-vars */
describe('ProductGrid Component', () => {
    let React;
    let ReactDOM;
    let ReactTestUtils;
    let ProductGrid;

    beforeEach(() => {
        React = require('react');
        ReactDOM = require('react-dom');
        ReactTestUtils = require('react-dom/test-utils');
        ProductGrid = require('components/ShadeFinder/ProductGrid/ProductGrid').default;
    });

    function createProductGrid(props = {}, isShallow = true) {
        return enzyme[isShallow ? 'shallow' : 'mount'](<ProductGrid {...props} />);
    }

    describe('lazy load images', () => {
        let productGrid, props;

        beforeEach(() => {
            props = {
                products: [
                    {
                        productId: 'P413909',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    },
                    {
                        productId: 'P418363',
                        brandName: 'AMOREPACIFIC'
                    }
                ]
            };
        });

        it('for mobile', () => {
            spyOn(Sephora, 'isDesktop').and.returnValue(false);
            productGrid = createProductGrid(props, true);

            const lazyLoadElement = productGrid.findWhere(n => n.name() === 'ErrorBoundary(Connect(ProductItem))');
            expect(lazyLoadElement.length).toEqual(8);
        });

        it('for desktop', () => {
            spyOn(Sephora, 'isDesktop').and.returnValue(true);
            productGrid = createProductGrid(props, true);

            const lazyLoadElement = productGrid.findWhere(n => n.name() === 'ErrorBoundary(Connect(ProductItem))');
            expect(lazyLoadElement.length).toEqual(12);
        });
    });
});
