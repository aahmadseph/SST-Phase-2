const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const analyticsConsts = require('analytics/constants').default;
const processEvent = require('analytics/processEvent').default;
const React = require('react');
const SwatchListDropdown = require('components/ProductPage/Swatches/SwatchListDropdown').default;
const swatchUtils = require('utils/Swatch').default;

describe('SwatchListDropdown component', () => {
    it('should bind "toggleMenu" function with FilterGroup "showModal" callback', () => {
        // Arrange
        const props = { product: {} };
        const wrapper = shallow(<SwatchListDropdown {...props} />);
        const component = wrapper.instance();
        const toggleMenu = spyOn(component, 'toggleMenu');

        // Act
        const showModal = wrapper.find('FilterGroup').prop('showModal');
        showModal(true, {});

        // Assert
        expect(toggleMenu).toHaveBeenCalledWith(true, {});
    });

    it('should bind "toggleMenu" function with FilterGroup "toggleDropdownOpen" callback', () => {
        // Arrange
        const props = { product: {} };
        const wrapper = shallow(<SwatchListDropdown {...props} />);
        const component = wrapper.instance();
        const toggleMenu = spyOn(component, 'toggleMenu');

        // Act
        const toggleDropdownOpen = wrapper.find('FilterGroup').prop('toggleDropdownOpen');
        toggleDropdownOpen(new Event('click'), true, {});

        // Assert
        expect(toggleMenu).toHaveBeenCalledWith(true, {});
    });

    it('should process Link tracking event when toggleMenu is clicked', () => {
        // Arrange
        const props = { product: {} };
        const processSpy = spyOn(processEvent, 'process');
        const wrapper = shallow(<SwatchListDropdown {...props} />);
        const component = wrapper.instance();

        // Act
        component.toggleMenu(true);

        // Assert
        expect(processSpy).toHaveBeenCalledWith(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: 'product:swatch selector modal:n/a*',
                actionInfo: 'view as list',
                linkName: 'D=c55'
            }
        });
    });

    it('should invoke "handleSkuOnClick" with last element from "onFilterChanged" first argument', () => {
        // Arrange
        const props = { product: {} };
        const selectedSkus = [{}, { skuId: 1 }];
        const handleSkuOnClick = spyOn(swatchUtils, 'handleSkuOnClick');
        const wrapper = shallow(<SwatchListDropdown {...props} />);
        wrapper.setState({ skus: [{ skuId: 1 }] });

        // Act
        wrapper.instance().onFilterChanged(selectedSkus);

        // Assert
        expect(handleSkuOnClick).toHaveBeenCalledWith(selectedSkus[1]);
    });

    it('should not invoke "handleSkuOnClick" for custom sets', () => {
        // Arrange
        const props = {
            isCustomSet: true,
            product: {}
        };
        const selectedSkus = [{}, { skuId: 1 }];
        const handleSkuOnClick = spyOn(swatchUtils, 'handleSkuOnClick');
        const wrapper = shallow(<SwatchListDropdown {...props} />);
        wrapper.setState({ skus: [{ skuId: 1 }] });

        // Act
        wrapper.instance().onFilterChanged(selectedSkus);

        // Assert
        expect(handleSkuOnClick).not.toHaveBeenCalled();
    });

    it('should invoke "onSelectedSkuChanged" when provided in props', () => {
        // Arrange
        const props = {
            onSelectedSkuChanged: createSpy('onSelectedSkuChanged'),
            product: {},
            isCustomSet: true
        };
        const selectedSkus = [{}, { skuId: 1 }];
        const wrapper = shallow(<SwatchListDropdown {...props} />);
        wrapper.setState({ skus: [{ skuId: 1 }] });

        // Act
        wrapper.instance().onFilterChanged(selectedSkus);

        // Assert
        expect(props.onSelectedSkuChanged).toHaveBeenCalled();
    });

    it('should update state when component rerendered with new product', () => {
        // Arrange
        const state = {
            productId: 1,
            skus: []
        };
        const newProps = {
            product: {
                onSaleChildSkus: [1],
                productDetails: { productId: 2 },
                regularChildSkus: [3]
            }
        };
        const newState = {
            productId: 2,
            skus: [3, 1]
        };

        // Act
        const result = SwatchListDropdown.getDerivedStateFromProps(newProps, state);

        // Assert
        expect(result).toEqual(newState);
    });
});
