const { shallow } = require('enzyme');
const React = require('react');

describe('<SwatchItem />', () => {
    let Swatch;
    let SwatchItem;
    let store;
    let props;

    beforeEach(() => {
        Swatch = require('utils/Swatch').default;
        SwatchItem = require('components/ProductPage/Swatches/SwatchItem').default;
        store = require('Store').default;
        props = {
            currentProduct: {
                productDetails: {
                    productId: 'PRODID',
                    brand: { brandName: 'BRAND' }
                },
                parentCategory: {
                    categoryId: 'CAT01',
                    displayName: 'CATEGORY'
                }
            },
            sku: {
                skuId: 1,
                smallImage: 'skuImage.jpg',
                isSameDayEligibleSku: false,
                isOutOfStock: false,
                isOnlineOnly: false,
                listPrice: '$20.50'
            },
            activeSku: {},
            swatchItemCallback: () => {},
            colorIQMatch: { skuId: '1234567' }
        };
    });

    it('should invoke "props.handleSkuOnClick" function when user clicks', () => {
        // Arrange
        spyOn(Swatch, 'updateDigitalDataProduct').and.callFake(() => {});
        const handleSkuOnClick = spyOn(Swatch, 'handleSkuOnClick');

        // Act
        shallow(<SwatchItem {...props} />)
            .find('SwatchButton')
            .simulate('click');

        // Assert
        expect(handleSkuOnClick).toHaveBeenCalledWith(props.sku);
    });

    it('should invoke "props.swatchItemCallback" function when user clicks', () => {
        // Arrange
        spyOn(Swatch, 'updateDigitalDataProduct').and.callFake(() => {});
        spyOn(Swatch, 'handleSkuOnClick').and.callFake(() => {});
        const swatchItemCallbackSpy = spyOn(props, 'swatchItemCallback');

        // Act
        shallow(<SwatchItem {...props} />)
            .find('SwatchButton')
            .simulate('click');

        // Assert
        expect(swatchItemCallbackSpy).toHaveBeenCalledWith(props.sku);
    });

    it('should not dispath a merge action for a hoveredSku as sku on MouseEnter if it is Touch', () => {
        // Arrange
        Sephora.isTouch = true;
        const dispatchSpy = spyOn(store, 'dispatch');

        // Act
        shallow(<SwatchItem {...props} />)
            .find('SwatchButton')
            .simulate('mouseEnter');
        Sephora.isTouch = false;

        // Assert
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    xit('should render button data-at with a given customSetDataAt', () => {
        // Arrange
        props.customSetDataAt = 'SomeCustomSetDataAt';
        const component = shallow(<SwatchItem {...props} />);

        // Act
        const element = component.findWhere(x => x.name() === 'button' && x.prop('data-at') === props.customSetDataAt);

        // Assert
        expect(element.exists()).toBeTruthy();
    });

    xit('should render button with a selected_swatch data-at if customSetDataAt is not provided', () => {
        // Arrange
        const component = shallow(<SwatchItem {...props} />);

        // Act
        const element = component.findWhere(x => x.name() === 'button' && x.prop('data-at') === 'selected_swatch');

        // Assert
        expect(element.exists()).toBeTruthy();
    });

    xit('should render img data-at if customSetDataAt is provided', () => {
        // Arrange
        props.isCustomSet = true;
        props.customSetDataAt = 'SomeCustomSetDataAt';
        const component = shallow(<SwatchItem {...props} />);

        // Act
        const element = component.findWhere(x => x.name() === 'img' && x.prop('data-at') === `${props.customSetDataAt}_img`);

        // Assert
        expect(element.exists()).toBeTruthy();
    });

    xit('should not render img data-at if customSetDataAt is not provided', () => {
        // Arrange
        props.isCustomSet = true;
        const component = shallow(<SwatchItem {...props} />);

        // Act
        const element = component.findWhere(x => x.name() === 'img' && x.prop('data-at') !== null);

        // Assert
        expect(element.exists()).toBeFalsy();
    });
});
