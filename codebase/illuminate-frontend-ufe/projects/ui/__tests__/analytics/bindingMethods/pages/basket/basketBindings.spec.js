import { DELIVERY_METHOD_TYPES } from 'constants/RwdBasket';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';
import basketUtils from 'utils/Basket';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: {
        BASKET: { CHECKOUT_STANDARD, CHECKOUT_BOPIS }
    },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;
const { STANDARD, BOPIS } = DELIVERY_METHOD_TYPES;

jest.mock('analytics/processEvent');
jest.mock('analytics/utils');
jest.mock('utils/Basket');

describe('BasketBindings', () => {
    describe('checkout', () => {
        it('should call processEvent.process with expected event data for standard checkout', () => {
            // Arrange
            const mockItems = [{ id: 1 }, { id: 2 }];
            const mockSkuIds = ['sku1', 'sku2'];
            const mockSubtotal = 100;
            basketUtils.getBasketItems.mockReturnValue(mockItems);
            analyticsUtils.buildProductSkusOnly.mockReturnValue(mockSkuIds);
            basketUtils.getSubtotal.mockReturnValue(mockSubtotal);
            const eventData = {
                data: {
                    linkName: CHECKOUT_STANDARD,
                    actionInfo: CHECKOUT_STANDARD,
                    specificEventName: CHECKOUT_STANDARD,
                    skuIds: mockSkuIds,
                    shippingMethod: STANDARD,
                    listSubTotal: mockSubtotal
                }
            };

            // Act
            BasketBindings.checkout({ isBopis: false });

            // Assert
            expect(processEvent.process).toHaveBeenCalledWith(SOT_LINK_TRACKING_EVENT, eventData);
        });

        it('should call processEvent.process with expected event data for BOPIS checkout', () => {
            // Arrange
            const mockItems = [{ id: 3 }, { id: 4 }];
            const mockSkuIds = ['sku3', 'sku4'];
            const mockSubtotal = 50;
            basketUtils.getBopisBasketItems.mockReturnValue(mockItems);
            analyticsUtils.buildProductSkusOnly.mockReturnValue(mockSkuIds);
            basketUtils.getSubtotal.mockReturnValue(mockSubtotal);
            const eventData = {
                data: {
                    linkName: CHECKOUT_BOPIS,
                    actionInfo: CHECKOUT_BOPIS,
                    specificEventName: CHECKOUT_BOPIS,
                    skuIds: mockSkuIds,
                    shippingMethod: BOPIS,
                    listSubTotal: mockSubtotal
                }
            };

            // Act
            BasketBindings.checkout({ isBopis: true });

            // Assert
            expect(processEvent.process).toHaveBeenCalledWith(SOT_LINK_TRACKING_EVENT, eventData);
        });
    });
});
