const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');
const RewardProduct = require('components/ProductPage/Type/RewardProduct/RewardProduct').default;

describe('RewardProduct component', () => {
    describe('Render', () => {
        let state;
        let props;

        beforeEach(() => {
            state = {
                currentProduct: {
                    currentSku: {},
                    productDetails: { productId: 12345 }
                }
            };

            props = {
                processSkuId: createSpy('processSkuId')
            };
        });

        it('should render LayoutTop', () => {
            // Arrange
            const component = shallow(<RewardProduct {...props} />, { disableLifecycleMethods: true });

            // Act
            component.setState(state);

            // Assert
            const layoutTop = component.find('LayoutTop');
            expect(layoutTop.exists()).toBeTruthy();
        });

        it('should render Info with a productDetails.longDescription if it is present and SKU is ready', () => {
            // Arrange
            const wrapper = shallow(<RewardProduct {...props} />, { disableLifecycleMethods: true });
            const longDescription = 'longDescription';
            state.currentProduct.productDetails.longDescription = longDescription;

            // Act
            wrapper.instance().isSkuReady = true;
            wrapper.setState(state);

            // Assert
            const Info = wrapper.find(`ConnectedInfo[description="${longDescription}"]`);
            expect(Info.exists()).toBeTruthy();
        });

        it('should render Info with a productDetails.shortDescription if it is present and SKU is ready', () => {
            // Arrange
            const wrapper = shallow(<RewardProduct {...props} />, { disableLifecycleMethods: true });
            const shortDescription = 'shortDescription';
            state.currentProduct.productDetails.shortDescription = shortDescription;

            // Act
            wrapper.instance().isSkuReady = true;
            wrapper.setState(state);

            // Assert
            const Info = wrapper.find(`ConnectedInfo[description="${shortDescription}"]`);
            expect(Info.exists()).toBeTruthy();
        });

        it('should render Info with a currentProduct.shortDescription if it is present and SKU is ready', () => {
            // Arrange
            const wrapper = shallow(<RewardProduct {...props} />, { disableLifecycleMethods: true });
            const shortDescription = 'shortDescription';
            state.currentProduct.shortDescription = shortDescription;

            // Act
            wrapper.instance().isSkuReady = true;
            wrapper.setState(state);

            // Assert
            const Info = wrapper.find(`ConnectedInfo[description="${shortDescription}"]`);
            expect(Info.exists()).toBeTruthy();
        });

        it('should render Info with a currentProduct.suggestedUsage if it is present and SKU is ready', () => {
            // Arrange
            const wrapper = shallow(<RewardProduct {...props} />, { disableLifecycleMethods: true });
            const suggestedUsage = 'suggestedUsage';
            state.currentProduct.suggestedUsage = suggestedUsage;

            // Act
            wrapper.instance().isSkuReady = true;
            wrapper.setState(state);

            // Assert
            const Info = wrapper.find(`ConnectedInfo[description="${suggestedUsage}"]`);
            expect(Info.exists()).toBeTruthy();
        });

        it('should render Info with a productDetails.suggestedUsage if it is present and SKU is ready', () => {
            // Arrange
            const wrapper = shallow(<RewardProduct {...props} />, { disableLifecycleMethods: true });
            const suggestedUsage = 'SomeSuggestedUsage';
            state.currentProduct.productDetails.suggestedUsage = suggestedUsage;

            // Act
            wrapper.instance().isSkuReady = true;
            wrapper.setState(state);

            // Assert
            const Info = wrapper.find(`ConnectedInfo[description="${suggestedUsage}"]`);
            expect(Info.exists()).toBeTruthy();
        });
    });

    describe('componentDidMount', () => {
        it('should call processSkuId', () => {
            const props = {
                processSkuId: createSpy('processSkuId')
            };
            // Act
            shallow(<RewardProduct {...props} />);

            // Assert
            expect(props.processSkuId).toHaveBeenCalled();
        });
    });
});
