describe('<Reward /> component', () => {
    const ADD_BUTTON_TYPE = require('utils/Basket').default.ADD_TO_BASKET_TYPES;
    let React;
    let Reward;
    let store;
    let shallowComponent;
    let props;

    beforeEach(() => {
        React = require('react');
        Reward = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/Type/Reward/Reward').default;
        store = require('Store').default;
        spyOn(store, 'setAndWatch');
        props = {
            currentProduct: {
                currentSku: {},
                currentSkuQuantity: 3,
                currentProductUserSpecificDetails: {}
            }
        };
    });

    describe('ConnectedAddToBasketButton', () => {
        it('should enable it if the reward is in basket and the user is not eligible', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = true;
            props.currentProduct.currentProductUserSpecificDetails.isEligible = false;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('disabled')).toEqual(false);
        });

        it('should enable it if the reward is in basket and the user is eligible', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = true;
            props.currentProduct.currentProductUserSpecificDetails.isEligible = true;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('disabled')).toEqual(false);
        });

        it('should enable it if the user is eligible and the reward is not in basket', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = false;
            props.currentProduct.currentProductUserSpecificDetails.isEligible = true;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('disabled')).toEqual(false);
        });

        it('should disable it if the user is not eligible and the reward is not in basket', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = false;
            props.currentProduct.currentProductUserSpecificDetails.isEligible = false;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('disabled')).toEqual(true);
        });

        it('should set the remove text', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = true;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('text')).toEqual('Remove');
        });

        it('should not set the remove text', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = false;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('text')).toEqual(null);
        });

        it('should set quantity', () => {
            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('quantity')).toEqual(
                props.currentProduct.currentSkuQuantity
            );
        });

        it('should set the product prop', () => {
            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('product')).toEqual(props.currentProduct);
        });

        it('should set the sku prop', () => {
            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('sku')).toEqual(props.currentProduct.currentSku);
        });

        it('should set the button variant to special', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = false;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('variant')).toEqual(ADD_BUTTON_TYPE.SPECIAL);
        });

        it('should set the button variant to primary', () => {
            // Arrange
            props.currentProduct.currentProductUserSpecificDetails.isInBasket = true;

            // Act
            shallowComponent = enzyme.shallow(<Reward {...props} />);

            // Assert
            expect(shallowComponent.find('ErrorBoundary(Connect(AddToBasketButton))').prop('variant')).toEqual(ADD_BUTTON_TYPE.PRIMARY);
        });
    });

    describe('BiQualify', () => {
        beforeEach(() => {
            shallowComponent = enzyme.shallow(<Reward {...props} />);
        });

        it('should render it if the user data is ready and user is not BI', () => {
            shallowComponent.setState({ isBI: false });

            expect(shallowComponent.find('BiQualify').length).toEqual(1);
        });

        it('should set the currentSku props', () => {
            shallowComponent.setState({ isBI: false });

            expect(shallowComponent.find('BiQualify').prop('currentSku')).toEqual(props.currentProduct.currentSku);
        });
    });
});
