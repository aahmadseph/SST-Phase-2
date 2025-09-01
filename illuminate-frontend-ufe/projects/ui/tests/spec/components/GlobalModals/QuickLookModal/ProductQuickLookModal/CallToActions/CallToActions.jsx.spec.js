/* eslint-disable no-unused-vars */
describe('CallToActions component', () => {
    let React;
    let shallow;
    let store;
    let CallToActions;
    let props;

    beforeEach(() => {
        React = require('react');
        shallow = enzyme.shallow;
        store = require('store/Store').default;
        CallToActions = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/CallToActions').default;
        props = {
            currentProduct: {
                currentSku: {
                    skuId: '1765007',
                    type: 'Standard'
                }
            },
            currentSku: {
                skuId: '1765007',
                type: 'Standard'
            }
        };
    });

    it('should render an AddToBasketButton component in modals', () => {
        // Arrange
        const callToActionsComponent = shallow(<CallToActions {...props} />);

        // Assert
        expect(callToActionsComponent.find('ErrorBoundary(Connect(AddToBasketButton))')).toBeDefined();
    });

    it('should render an AddToBasketButton component when not in modals', () => {
        // Arrange
        props = {
            currentProduct: {
                currentSku: {
                    skuId: '1765007',
                    type: 'Standard'
                }
            },
            currentSku: {
                skuId: '1765007',
                type: 'Standard'
            }
        };
        const callToActionsComponent = shallow(<CallToActions {...props} />);

        // Assert
        expect(callToActionsComponent.find('ErrorBoundary(Connect(AddToBasketButton))')).toBeDefined();
    });
});
