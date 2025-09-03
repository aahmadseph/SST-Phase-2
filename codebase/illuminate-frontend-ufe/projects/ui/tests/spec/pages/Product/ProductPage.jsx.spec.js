const { shallow } = require('enzyme');
const productActions = require('actions/ProductActions').default;
const ProductPage = require('pages/Product/ProductPage').default;
const React = require('react');
const skuUtils = require('utils/Sku').default;
const skuHelpers = require('utils/skuHelpers').default;
const store = require('Store').default;
const urlUtils = require('utils/Url').default;
const userUtils = require('utils/User').default;

const {
    PRODUCT_IDS: { SAMPLE },
    SKU_ID_PARAM,
    skuTypes: { ROUGE_REWARD_CARD }
} = skuUtils;

describe('ProductPage component', () => {
    it('should not re-render with the same state', () => {
        // Arrange
        const state = {
            product: {
                currentSku: {},
                errorCode: undefined,
                productDetails: { productId: 1 }
            }
        };

        // Act
        const wrapper = shallow(<ProductPage />).setState(state);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setState(state);
        wrapper.setState(state);

        // Assert
        expect(render).toHaveBeenCalledTimes(0);
    });

    it('should re-render only once when errorCode has changed', () => {
        // Arrange
        const state = { product: { errorCode: undefined } };
        const newState = { product: { errorCode: 404 } };

        // Act
        const wrapper = shallow(<ProductPage />).setState(state);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setState(newState);
        wrapper.setState(newState);

        // Assert
        expect(render).toHaveBeenCalledTimes(1);
    });

    it('should re-render only once when productId has changed', () => {
        // Arrange
        const state = { product: { productDetails: { productId: 1 } } };
        const newState = { product: { productDetails: { productId: 2 } } };

        // Act
        const wrapper = shallow(<ProductPage />).setState(state);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setState(newState);
        wrapper.setState(newState);

        // Assert
        expect(render).toHaveBeenCalledTimes(1);
    });

    it('should re-render only once when currentSku has changed', () => {
        // Arrange
        const state = { product: { currentSku: {} } };
        const newState = { product: { currentSku: { rewardSubType: ROUGE_REWARD_CARD } } };

        // Act
        const wrapper = shallow(<ProductPage />).setState(state);
        const component = wrapper.instance();
        const render = spyOn(component, 'render');
        wrapper.setState(newState);
        wrapper.setState(newState);

        // Assert
        expect(render).toHaveBeenCalledTimes(1);
    });

    it('should wait for ProductInfoReady', () => {
        // Arrange
        const Events = require('utils/framework/Events').default;
        const onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');

        // Act
        shallow(<ProductPage />);

        // Assert
        expect(onLastLoadEventStub).toHaveBeenCalledWith(window, ['ProductInfoReady'], jasmine.any(Function));
    });

    it('should call validateUserStatus', () => {
        // Arrange
        const Events = require('utils/framework/Events').default;
        const onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
        const validateUserStatus = spyOn(userUtils, 'validateUserStatus').and.returnValue(Promise.resolve());

        // Act
        shallow(<ProductPage />);
        onLastLoadEventStub.calls.first().args[2]();

        // Assert
        expect(validateUserStatus).toHaveBeenCalledTimes(1);
    });

    describe('processSkuId', () => {
        let component;

        beforeEach(() => {
            component = shallow(<ProductPage />, { disableLifecycleMethods: true })
                .setState({
                    currentProduct: {
                        productData: 'productData',
                        productDetails: { productId: 12345 },
                        currentSku: {
                            skuId: 67890,
                            skuData: 'skuData',
                            biExclusiveLevel: 'none'
                        },
                        regularChildSkus: [{ skuId: 1 }, { skuId: 2 }, { skuId: 3 }]
                    },
                    user: { userName: 'testUser' }
                })
                .instance();
        });

        it('should get sku ID from url param', () => {
            // Arrange
            const getParamsByName = spyOn(urlUtils, 'getParamsByName');

            // Act
            component.processSkuId({});

            // Assert
            expect(getParamsByName).toHaveBeenCalledWith(SKU_ID_PARAM);
        });

        describe('code for when there is an array of skuids in url params', () => {
            it('should get SKU from product', () => {
                // Arrange
                const storeData = {
                    page: { product: { regularChildSkus: [{ skuId: 1 }, { skuId: 2 }, { skuId: 3 }] } },
                    historyLocation: { queryParams: 'queryParams' }
                };
                spyOn(store, 'getState').and.returnValue(storeData);
                spyOn(urlUtils, 'getParamsByName').and.returnValue([1, 2, 3]);
                const getSkuFromProduct = spyOn(skuHelpers, 'getSkuFromProduct');

                // Act
                component.processSkuId({});

                // Assert
                expect(getSkuFromProduct).toHaveBeenCalledWith(storeData.page.product, storeData.page.product.regularChildSkus[0].skuId);
            });

            it('should dispath updateSkuInCurrentProduct action when there is a requested SKU from URL in product', () => {
                // Arrange
                const storeData = {
                    page: { product: { regularChildSkus: [{ skuId: 1 }, { skuId: 2 }, { skuId: 3 }] } },
                    historyLocation: { queryParams: 'queryParams' }
                };
                spyOn(store, 'getState').and.returnValue(storeData);
                spyOn(urlUtils, 'getParamsByName').and.returnValue([1]);
                spyOn(skuHelpers, 'getSkuFromProduct').and.returnValue(true);
                const action = 'updateSkuInCurrentProduct';
                spyOn(productActions, 'updateSkuInCurrentProduct').and.returnValue(action);
                const dispatch = spyOn(store, 'dispatch');

                // Act
                component.processSkuId({});

                // Assert
                expect(dispatch).toHaveBeenCalledWith(action, { disableDispatchWarning: true });
            });

            it('should execute code for when currentProduct is a sample', () => {
                // Arrange
                const storeData = {
                    page: {
                        product: {
                            productId: SAMPLE,
                            regularChildSkus: [{ skuId: 1 }, { skuId: 2 }, { skuId: 3 }]
                        }
                    },
                    historyLocation: { queryParams: 'queryParams' }
                };
                spyOn(store, 'getState').and.returnValue(storeData);
                spyOn(urlUtils, 'getParamsByName').and.returnValue([1]);
                const action = 'fetchCurrentProduct';
                spyOn(productActions, 'fetchCurrentProduct').and.returnValue(action);
                const dispatch = spyOn(store, 'dispatch');

                // Act
                component.processSkuId({});

                // Assert
                expect(dispatch).toHaveBeenCalledWith(action, { disableDispatchWarning: true });
            });
        });
    });
});
