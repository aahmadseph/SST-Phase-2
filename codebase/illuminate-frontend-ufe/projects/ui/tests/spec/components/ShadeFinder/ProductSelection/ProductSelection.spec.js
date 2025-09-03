const React = require('react');
const { shallow } = enzyme;

describe('ProductSelection component', () => {
    let wizardObject;

    describe('selectProduct method', () => {
        it('should selectProduct method beenCalledOnce', () => {
            // Arrange
            const wizardActions = require('actions/WizardActions').default;
            const ProductSelection = require('components/ShadeFinder/ProductSelection/ProductSelection').default;
            const component = new ProductSelection({});
            const goToNextPageStub = spyOn(wizardActions, 'goToNextPage');

            // Act
            component.selectProduct(123);

            // Assert
            expect(goToNextPageStub).toHaveBeenCalledTimes(1);
        });

        it('should dispatch goToNextPage wizard action', () => {
            // Arrange
            const ProductSelection = require('components/ShadeFinder/ProductSelection/ProductSelection').default;
            const component = new ProductSelection({});
            const store = require('store/Store').default;
            const dispatchStub = spyOn(store, 'dispatch');

            // Act
            component.selectProduct(123);

            // Assert
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('render', function () {
        let nextState;
        let component;

        beforeEach(() => {
            const ProductSelection = require('components/ShadeFinder/ProductSelection/ProductSelection').default;
            const store = require('store/Store').default;

            wizardObject = {
                wizard: {
                    dataArray: [{ brandId: '5723' }],
                    componentIndex: 0
                }
            };
            nextState = {
                productList: [
                    {
                        brandName: 'Antonym',
                        categoryName: 'Foundation',
                        currentSku: {
                            biExclusiveLevel: 'none',
                            imageAltText: 'Antonym - Skin Esteem Organic Liquid Foundation',
                            isAppExclusive: false,
                            isBI: false,
                            isBest: false,
                            isFirstAccess: false,
                            isLimitedEdition: false,
                            isLimitedTimeOffer: false,
                            isNatural: false,
                            isNew: false,
                            isOnlineOnly: true,
                            isOrganic: false,
                            isSephoraExclusive: false,
                            listPrice: '$52.00',
                            salePrice: '',
                            skuId: '2016269',
                            skuType: 'Standard',
                            typeDisplayName: 'Standard'
                        },
                        displayName: 'Skin Esteem Organic Liquid Foundation',
                        heroImage: '/productimages/sku/s2016269-main-grid.jpg',
                        heroImageAltText: 'Clean at Sephora',
                        image135: '/productimages/sku/s2016269-main-grid.jpg',
                        image250: '/productimages/sku/s2016269-main-hero.jpg',
                        image450: '/productimages/sku/s2016269-main-Lhero.jpg',
                        moreColors: 5,
                        productId: 'P425621',
                        rating: '0.0',
                        targetUrl: '/product/skin-esteem-organic-liquid-foundation-P425621',
                        url: 'http://10.105.36.160:80/v1/catalog/products/P425621?preferedSku=2016269'
                    }
                ]
            };

            spyOn(store, 'getState').and.returnValue(wizardObject);

            component = shallow(<ProductSelection />, { disableLifecycleMethods: true });
            component.setState(nextState);
        });

        it('should render ProductItem', function () {
            expect(component.find('ErrorBoundary(Connect(ProductItem))').exists()).toBe(true);
        });

        it('should pass down productId to ProductItem', function () {
            const productItemComponent = component.find('ErrorBoundary(Connect(ProductItem))');
            const productId = productItemComponent.prop('productId');
            expect(productId).not.toBe(undefined);
        });
    });
});
