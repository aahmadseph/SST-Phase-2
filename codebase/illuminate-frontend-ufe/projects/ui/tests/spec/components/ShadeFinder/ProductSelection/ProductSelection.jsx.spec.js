const { shallow } = enzyme;

describe('ProductSelection', () => {
    let React;
    let ProductSelection;
    let wizardObject;
    let store;
    let shallowComponent;
    let productListMock;

    beforeEach(() => {
        React = require('react');
        ProductSelection = require('components/ShadeFinder/ProductSelection/ProductSelection').default;
        store = require('store/Store').default;

        wizardObject = {
            wizard: {
                dataArray: [{ brandId: '5723' }],
                componentIndex: 0
            }
        };

        productListMock = [
            {
                brandName: 'Amazing Cosmetics',
                categoryName: 'Foundation',
                currentSku: {
                    biExclusiveLevel: 'none',
                    imageAltText: 'Amazing Cosmetics - Velvet Mineral Pressed Powder Foundation',
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
                    listPrice: '$36.00',
                    salePrice: '',
                    skuId: '1412063',
                    skuType: 'Standard'
                },
                displayName: 'Velvet Mineral Pressed Powder Foundation',
                heroImage: '/productimages/sku/s1412063-main-grid.jpg',
                image135: '/productimages/sku/s1412063-main-grid.jpg',
                image250: '/productimages/sku/s1412063-main-hero.jpg',
                image450: '/productimages/sku/s1412063-main-Lhero.jpg',
                moreColors: 7,
                productId: 'P208609',
                rating: '2.0',
                targetUrl: '/product/velvet-mineral-pressed-powder-foundation-P208609',
                url: 'http://10.105.36.160:80/v1/catalog/products/P208609?preferedSku=1412063'
            },
            {
                brandName: 'Amazing Cosmetics',
                categoryName: 'Foundation',
                currentSku: {
                    biExclusiveLevel: 'none',
                    imageAltText: 'Amazing Cosmetics - Velvet Mineral® Liquid Custom Finish Foundation SPF 15',
                    isAppExclusive: false,
                    isBI: false,
                    isBest: false,
                    isFirstAccess: false,
                    isLimitedEdition: false,
                    isLimitedTimeOffer: false,
                    isNatural: false,
                    isNew: false,
                    isOnlineOnly: false,
                    isOrganic: false,
                    isSephoraExclusive: false,
                    listPrice: '$36.00',
                    salePrice: '',
                    skuId: '1411990',
                    skuType: 'Standard'
                },
                displayName: 'Velvet Mineral® Liquid Custom Finish Foundation SPF 15',
                heroImage: '/productimages/sku/s1411990-main-grid.jpg',
                image135: '/productimages/sku/s1411990-main-grid.jpg',
                image250: '/productimages/sku/s1411990-main-hero.jpg',
                image450: '/productimages/sku/s1411990-main-Lhero.jpg',
                moreColors: 8,
                productId: 'P312404',
                rating: '0.0',
                targetUrl: '/product/velvet-mineral-liquid-custom-finish-foundation-spf-15-P312404',
                url: 'http://10.105.36.160:80/v1/catalog/products/P312404?preferedSku=1411990'
            }
        ];

        spyOn(store, 'getState').and.returnValue(wizardObject);
        shallowComponent = shallow(<ProductSelection />, { disableLifecycleMethods: true });
        shallowComponent.setState({ productList: productListMock });
    });

    it('Should render 2 children', () => {
        expect(shallowComponent.props().children.length).toBe(2);
    });

    describe('WizardSubhead', () => {
        let WizardSubhead;
        beforeEach(() => {
            WizardSubhead = shallowComponent.find('WizardSubhead').children(0);
        });

        it('Should render 3 children ', () => {
            expect(WizardSubhead.length).toBe(3);
        });

        it('should render brand name', () => {
            expect(WizardSubhead.children(0).text()).toBe(productListMock[0].brandName);
        });
    });

    describe('WizardBody', () => {
        let WizardBody;
        beforeEach(() => {
            WizardBody = shallowComponent.find('WizardBody');
        });
        it('Should render selected brand productslist', () => {
            expect(WizardBody.children(0).props(0).children.length).toBe(productListMock.length);
        });
    });
});
