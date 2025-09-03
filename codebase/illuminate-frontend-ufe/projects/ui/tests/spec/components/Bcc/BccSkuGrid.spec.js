const React = require('react');
const { shallow, mount } = require('enzyme');
const BccSkuGrid = require('components/Bcc/BccSkuGrid/BccSkuGrid').default;
const { COPY_TEXT_PLACEMENT } = require('utils/BCC').default;

const createBccSkuGrid = (props = {}, isShallow = true) => {
    if (isShallow) {
        return shallow(
            <BccSkuGrid
                lazyLoad='img'
                {...props}
            />
        );
    }

    return mount(
        <BccSkuGrid
            lazyLoad='img'
            {...props}
        />
    );
};

describe('BccSkuGrid Component', () => {
    it('should not render anything when empty', () => {
        // Arrange
        const props = { lazyLoad: 'img' };

        // Act
        const wrapper = shallow(<BccSkuGrid {...props} />);

        // Assert
        expect(wrapper.children().length > 0).toBeFalsy();
    });

    describe('title area', () => {
        let bccSkuGrid, props;

        beforeEach(() => {
            props = {
                alignment: 'Center',
                cols: 4,
                mobileWebAlignment: 'Left',
                mobileWebSubHead: 'mobile subhead',
                mobileWebTitleText: 'title mobile',
                rows: 10,
                skuImageSize: 135,
                titleImageAltText: 'img alt text',
                skus: [
                    {
                        componentName: 'Sephora Sku Component',
                        componentType: 13,
                        copyText: 'BLACK FRIDAY EXCLUSIVE',
                        sku: {
                            biExclusiveLevel: 'none',
                            brandName: 'The Art of Shaving',
                            image: '/productimages/sku/s1187095-main-grid.jpg',
                            isBiOnly: false,
                            isFree: false,
                            isLimitedEdition: false,
                            isLimitedQuantity: false,
                            isNaturalOrganic: false,
                            isNaturalSephora: false,
                            isNew: false,
                            isOnlineOnly: false,
                            isOutOfStock: false,
                            isSephoraExclusive: false,
                            listPrice: '$30.00',
                            productId: 'P381300',
                            productName: 'The 4 Elements Of The Perfect Shave® Starter Kit',
                            skuId: '1187095',
                            skuImages: {
                                image135: '/productimages/sku/s1187095-main-grid.jpg',
                                image162: '/productimages/sku/s1187095-162.jpg',
                                image250: '/productimages/sku/s1187095-main-hero.jpg',
                                image42: '/productimages/sku/s1187095-main-thumb.jpg',
                                image450: '/productimages/sku/s1187095-main-Lhero.jpg',
                                image62: '/productimages/sku/s1187095-main-Lthumb.jpg',
                                image97: '/productimages/sku/s1187095-main-Sgrid.jpg'
                            },
                            starRatings: 0,
                            targetUrl: '/product/the-4-elements-of-the-perfect-shave-P381300',
                            url: 'http://10.105.36.156:80/v1/catalog/products/P381300'
                        },
                        style: {}
                    }
                ],
                subHead: 'subhead desktop',
                title: 'sku grid'
            };
        });

        it('should exist when imagePath not provided', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            bccSkuGrid = createBccSkuGrid(props, true);

            const containerElement = bccSkuGrid
                .findWhere(n => n.name() === 'Box')
                .at(0)
                .childAt(0);

            expect(containerElement.exists()).toBeTruthy();
        });

        // it('should render title and subHead for desktop - shallow render', () => {
        //     spyOn(Sephora, 'isMobile').and.returnValue(false);
        //     bccSkuGrid = createBccSkuGrid(props, true);

        //     const containerElement = bccSkuGrid
        //         .findWhere(n => n.name() === 'Box')
        //         .at(0)
        //         .childAt(0);

        //     expect(containerElement.name()).not.toEqual('Image');
        //     expect(containerElement.name()).toEqual('Box');
        //     expect(containerElement.prop('textAlign')).toEqual('center');

        //     const titleElement = containerElement.findWhere(n => n.name() === 'Box' && n.prop('children') === props.title);
        //     expect(titleElement.exists()).toBeTruthy();

        //     const subheadElement = containerElement.findWhere(n => n.name() === 'Box' && n.prop('children') === props.subHead);
        //     expect(subheadElement.exists()).toBeTruthy();
        // });

        // it('should render title and subHead for mobile', () => {
        //     spyOn(Sephora, 'isMobile').and.returnValue(true);
        //     bccSkuGrid = createBccSkuGrid(props, true);

        //     const containerElement = bccSkuGrid
        //         .findWhere(n => n.name() === 'Box')
        //         .at(0)
        //         .childAt(0);

        //     expect(containerElement.name()).not.toEqual('Image');
        //     expect(containerElement.name()).toEqual('Box');
        //     expect(containerElement.prop('textAlign')).toEqual('left');

        //     const titleElement = containerElement.findWhere(n => n.name() === 'Box' && n.prop('children') === props.mobileWebTitleText);
        //     expect(titleElement.exists()).toBeTruthy();

        //     const subheadElement = containerElement.findWhere(n => n.name() === 'Box' && n.prop('children') === props.mobileWebSubHead);
        //     expect(subheadElement.exists()).toBeTruthy();
        // });

        it('should exist when imagePath provided', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            bccSkuGrid = createBccSkuGrid(Object.assign(props, { imagePath: '/contentimages/search/searchresults/sr_default.jpeg' }), true);

            const containerElement = bccSkuGrid
                .findWhere(n => n.name() === 'Box')
                .at(0)
                .childAt(0);

            expect(containerElement.exists()).toBeTruthy();
        });

        it('should render imagePath when provided', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            bccSkuGrid = createBccSkuGrid(Object.assign(props, { imagePath: '/contentimages/search/searchresults/sr_default.jpeg' }), true);

            const containerElement = bccSkuGrid
                .findWhere(n => n.name() === 'Box')
                .at(0)
                .childAt(0);

            expect(containerElement.name()).toEqual('Image');
            expect(containerElement.name()).not.toEqual('Box');
            expect(containerElement.prop('src')).toEqual(props.imagePath);
            expect(containerElement.prop('alt')).toEqual(props.titleImageAltText);
        });
    });

    describe('grid area', () => {
        let bccSkuGrid, props;

        beforeEach(() => {
            props = {
                showBadges: true,
                isShowFlags: true,
                isShowStarRatings: true,
                showLoves: true,
                showPrice: true,
                skuImageSize: 250,
                useAddToBasket: true,
                alignment: 'Center',
                cols: 4,
                displayCopy: COPY_TEXT_PLACEMENT.TOP,
                mobileWebAlignment: 'Left',
                mobileWebSubHead: 'mobile subhead',
                mobileWebTitleText: 'title mobile',
                rows: 10,
                skus: [
                    {
                        componentName: 'Sephora Sku Component',
                        componentType: 13,
                        copyText: 'BLACK FRIDAY EXCLUSIVE',
                        sku: {
                            biExclusiveLevel: 'none',
                            brandName: 'The Art of Shaving',
                            image: '/productimages/sku/s1187095-main-grid.jpg',
                            isBiOnly: false,
                            isFree: false,
                            isLimitedEdition: false,
                            isLimitedQuantity: false,
                            isNaturalOrganic: false,
                            isNaturalSephora: false,
                            isNew: false,
                            isOnlineOnly: false,
                            isOutOfStock: false,
                            isSephoraExclusive: false,
                            listPrice: '$30.00',
                            productId: 'P381300',
                            productName: 'The 4 Elements Of The Perfect Shave® Starter Kit',
                            skuId: '1187095',
                            skuImages: {
                                image135: '/productimages/sku/s1187095-main-grid.jpg',
                                image162: '/productimages/sku/s1187095-162.jpg',
                                image250: '/productimages/sku/s1187095-main-hero.jpg',
                                image42: '/productimages/sku/s1187095-main-thumb.jpg',
                                image450: '/productimages/sku/s1187095-main-Lhero.jpg',
                                image62: '/productimages/sku/s1187095-main-Lthumb.jpg',
                                image97: '/productimages/sku/s1187095-main-Sgrid.jpg'
                            },
                            starRatings: 0,
                            targetUrl: '/product/the-4-elements-of-the-perfect-shave-P381300',
                            url: 'http://10.105.36.156:80/v1/catalog/products/P381300'
                        },
                        style: {}
                    }
                ],
                subHead: 'subhead desktop',
                title: 'sku grid'
            };
        });

        it('should render grid with top copy placement for desktop', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            bccSkuGrid = createBccSkuGrid(props, true);

            const containerElement = bccSkuGrid.findWhere(n => n.key() === 'P381300');

            expect(containerElement.exists()).toBeTruthy();

            const copyElement = containerElement.findWhere(n => n.name() === 'Markdown');

            expect(copyElement.exists()).toBeTruthy();
            expect(copyElement.prop('content')).toEqual(props.skus[0].copyText);
        });

        it('should render grid with bottom copy placement for desktop', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            bccSkuGrid = createBccSkuGrid(Object.assign(props, { displayCopy: COPY_TEXT_PLACEMENT.BOTTOM }), true);

            const containerElement = bccSkuGrid.findWhere(n => n.key() === 'P381300');

            expect(containerElement.exists()).toBeTruthy();

            const copyElement = containerElement.findWhere(n => n.name() === 'Markdown');

            expect(copyElement.exists()).toBeTruthy();
            expect(copyElement.prop('content')).toEqual(props.skus[0].copyText);
        });

        it('should not render grid with hide copy placement for desktop', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            bccSkuGrid = createBccSkuGrid(Object.assign(props, { displayCopy: COPY_TEXT_PLACEMENT.HIDE }), true);

            const containerElement = bccSkuGrid.findWhere(n => n.key() === 'P381300');

            expect(containerElement.exists()).toBeTruthy();

            const copyElement = containerElement.findWhere(n => n.name() === 'Markdown');

            expect(copyElement.exists()).toBeFalsy();
        });

        it('should render grid with a product item', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            bccSkuGrid = createBccSkuGrid(props, true);

            const containerElement = bccSkuGrid.findWhere(n => n.key() === 'P381300');

            expect(containerElement.exists()).toBeTruthy();

            const productItemElement = containerElement.find('ErrorBoundary(Connect(ProductItem))');
            expect(productItemElement.exists()).toBeTruthy();
            expect(productItemElement.prop('productName')).toEqual(props.skus[0].sku.productName);
            expect(productItemElement.prop('skuId')).toEqual(props.skus[0].sku.skuId);
            expect(productItemElement.prop('brandName')).toEqual(props.skus[0].sku.brandName);
            expect(productItemElement.prop('image')).toEqual(props.skus[0].sku.image);
            expect(productItemElement.prop('productId')).toEqual(props.skus[0].sku.productId);
            expect(productItemElement.prop('targetUrl')).toEqual(props.skus[0].sku.targetUrl);
            expect(productItemElement.prop('url')).toEqual(props.skus[0].sku.url);
            expect(productItemElement.prop('showBadges')).toEqual(props.showBadges);
            expect(productItemElement.prop('showMarketingFlags')).toEqual(props.isShowFlags);
            expect(productItemElement.prop('showReviews')).toEqual(props.isShowStarRatings);
            expect(productItemElement.prop('showLoves')).toEqual(props.showLoves);
            expect(productItemElement.prop('showPrice')).toEqual(props.showPrice);
            expect(productItemElement.prop('imageSize')).toEqual(props.skuImageSize);
            expect(productItemElement.prop('useAddToBasket')).toEqual(props.useAddToBasket);
        });

        it('should render grid with multiple rows and columns', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);

            props.cols = 5;
            props.rows = 3;

            const sku = props.skus[0];

            for (let i = 0; i < 12; i++) {
                props.skus.push(Object.assign({}, sku));
            }

            bccSkuGrid = createBccSkuGrid(props, true);

            const row0 = bccSkuGrid.findWhere(n => n.key() === 'row-0');
            expect(row0.exists()).toBeTruthy();
            expect(row0.children().length).toEqual(5);

            const row1 = bccSkuGrid.findWhere(n => n.key() === 'row-1');
            expect(row1.exists()).toBeTruthy();
            expect(row1.children().length).toEqual(5);

            const row2 = bccSkuGrid.findWhere(n => n.key() === 'row-2');
            expect(row2.exists()).toBeTruthy();
            expect(row2.children().length).toEqual(3);

            const row3 = bccSkuGrid.findWhere(n => n.key() === 'row-3');
            expect(row3.exists()).toBeFalsy();
        });

        it('should ignore out of stock', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);

            props.ignoreOOSTreatment = true;
            props.skus[0].sku.isOutOfStock = true;

            bccSkuGrid = createBccSkuGrid(props, true);

            const row0 = bccSkuGrid.findWhere(n => n.key() === 'row-0');
            expect(row0.exists()).toBeTruthy();
            expect(row0.children().length).toEqual(1);
        });
    });
});
