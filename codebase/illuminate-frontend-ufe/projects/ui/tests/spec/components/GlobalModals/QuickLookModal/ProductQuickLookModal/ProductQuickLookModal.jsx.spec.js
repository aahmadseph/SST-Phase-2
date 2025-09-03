const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

xdescribe('ProductQuickLookModal component', () => {
    let commonProps;
    let ProductQuickLookModal;

    beforeEach(() => {
        const currentSku = {
            type: 'Standart',
            skuImages: {},
            biExclusiveLevel: '',
            actionFlags: {},
            targetUrl: '/product/test',
            listPrice: '$21.00'
        };
        commonProps = {
            currentSku,
            product: {
                regularChildSkus: [],
                currentSku,
                productStringContainerName: 'test',
                shortDescription: 'test',
                productDetails: {
                    lovesCount: 10,
                    displayName: 'someProductName',
                    brand: { displayName: 'someBrand' }
                }
            },
            isOpen: true
        };

        ProductQuickLookModal = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookModal').default;

        spyOn(Sephora, 'isDesktop').and.returnValue(true);
    });

    describe('<AddToBasketButton /> rendering', () => {
        // TODO: workaround needed for FocusTrap component
        xit('it should render component if isAppExclusive flag is NOT true', () => {
            const wrapper = shallow(<ProductQuickLookModal {...commonProps} />);
            expect(wrapper.find('ConnectedAddToBasketButton').first().prop('disabled')).not.toEqual(true);
        });
        xit('it should render disabled component if isAppExclusive flag is true', () => {
            commonProps.currentSku.isAppExclusive = true;
            const wrapper = shallow(<ProductQuickLookModal {...commonProps} />);
            expect(wrapper.find('ConnectedAddToBasketButton').first().prop('disabled')).toEqual(true);
        });

        xit('it should pass rootContainerName from props', () => {
            commonProps.rootContainerName = 'just arrived';
            const wrapper = shallow(<ProductQuickLookModal {...commonProps} />);
            expect(wrapper.find('ConnectedAddToBasketButton').first().prop('rootContainerName')).toEqual('just arrived');
        });
    });

    describe('<SkuQuantity /> rendering', () => {
        it('it should render component if isAppExclusive flag is NOT true', () => {
            const wrapper = shallow(<ProductQuickLookModal {...commonProps} />);
            expect(wrapper.find('SkuQuantity').first().prop('disabled')).not.toEqual(true);
        });

        it('it should render disabled component if isAppExclusive flag is true', () => {
            commonProps.currentSku.isAppExclusive = true;
            const wrapper = shallow(<ProductQuickLookModal {...commonProps} />);
            expect(wrapper.find('SkuQuantity').first().prop('disabled')).toEqual(true);
        });
    });

    describe('Brand and product title Link rendering', () => {
        it('it should render a Link component for the brand name and product title', () => {
            const wrapper = shallow(<ProductQuickLookModal {...commonProps} />);
            expect(wrapper.find('Link').first().prop('hoverSelector')).toEqual('.Link-target');
        });
    });

    describe('openProductPage function', () => {
        let Location;
        const event = {};

        beforeEach(() => {
            Location = require('utils/Location').default;
        });

        it('should invoke "this.fireLinkTracking" function', () => {
            // Arrange
            spyOn(Location, 'navigateTo');
            const props = {
                ...commonProps,
                requestClose: () => {}
            };
            const component = shallow(<ProductQuickLookModal {...props} />).instance();
            const fireLinkTracking = spyOn(component, 'fireLinkTracking');

            // Act
            component.openProductPage(event);

            // Assert
            expect(fireLinkTracking).toHaveBeenCalledTimes(1);
        });

        it('should invoke "historyService.splitURL" function', () => {
            // Arrange
            const navigateToSpy = spyOn(Location, 'navigateTo');
            const props = {
                ...commonProps,
                requestClose: () => {}
            };
            const component = shallow(<ProductQuickLookModal {...props} />).instance();

            // Act
            component.openProductPage(event);

            // Assert
            expect(navigateToSpy).toHaveBeenCalledTimes(1);
        });

        it('should invoke "requestClose" function', () => {
            // Arrange
            spyOn(Location, 'navigateTo');
            const requestClose = createSpy('requestClose');
            const props = {
                ...commonProps,
                requestClose
            };
            const component = shallow(<ProductQuickLookModal {...props} />).instance();

            // Act
            component.openProductPage(event);

            // Assert
            expect(requestClose).toHaveBeenCalledTimes(1);
        });
    });

    it('should invoke "this.openProductPage" when user click on product name', () => {
        // Arrange
        const skuUtils = require('utils/Sku').default;
        const Location = require('utils/Location').default;
        spyOn(skuUtils, 'productUrl');
        spyOn(Location, 'navigateTo');
        const props = {
            ...commonProps,
            requestClose: () => {}
        };
        const wrapper = shallow(<ProductQuickLookModal {...props} />);
        const component = wrapper.instance();
        const openProductPage = spyOn(component, 'openProductPage');

        // Act
        wrapper.find('Link[hoverSelector=".Link-target"]').simulate('click');

        // Assert
        expect(openProductPage).toHaveBeenCalledTimes(1);
    });

    it('should invoke "this.openProductPage" when user click on product description', () => {
        // Arrange
        const skuUtils = require('utils/Sku').default;
        const Location = require('utils/Location').default;
        spyOn(skuUtils, 'productUrl');
        spyOn(Location, 'navigateTo');
        const props = {
            ...commonProps,
            requestClose: () => {}
        };
        const wrapper = shallow(<ProductQuickLookModal {...props} />);
        const component = wrapper.instance();
        const openProductPage = spyOn(component, 'openProductPage');

        // Act
        wrapper.find('Link[data-ql-product-details]').simulate('click');

        // Assert
        expect(openProductPage).toHaveBeenCalledTimes(1);
    });

    describe('Data-at', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<ProductQuickLookModal {...commonProps} />);
        });

        it('should render data-at attribute for brand name', () => {
            expect(wrapper.find('[data-at="ql_brand"]').length).toBe(1);
        });

        it('should render data-at attribute for product name', () => {
            expect(wrapper.find('[data-at="ql_name"]').length).toBe(1);
        });

        it('should render data-at attribute for product description', () => {
            expect(wrapper.find('[data-at="ql_product_details"]').length).toBe(1);
        });

        it('should render data-at attribute for product price', () => {
            expect(wrapper.find('[data-at="ql_price_list"]').length).toBe(1);
        });

        it('should render data-at attribute for product rating', () => {
            expect(wrapper.find('[data-at="ql_rating_label"]').length).toBe(1);
        });

        it('should render data-at attribute for product love count', () => {
            expect(wrapper.find('[data-at="ql_love_count"]').length).toBe(1);
        });

        it('should render data-at attribute for product image', () => {
            expect(wrapper.find('[data-at="ql_image"]').length).toBe(1);
        });

        it('should render data-at attribute for product sku size and number', () => {
            expect(wrapper.find('[data-at="ql_sku_size_and_number"]').length).toBe(1);
        });

        it('should render data-at attribute for product add to basket button', () => {
            expect(wrapper.find('[data-at="ql_add_to_basket"]').length).toBe(1);
        });
    });
});
