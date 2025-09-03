const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');

describe('CheckoutPromoSection component', () => {
    let store;
    let orderUtils;
    let CheckoutPromoSection;
    let component;
    let isDesktopStub;
    let setAndWatch;
    let setAndWatchStub;
    let setStateStub;
    let getGlobalPromoCountStub;

    beforeEach(() => {
        store = require('Store').default;
        setAndWatch = store.setAndWatch;
        setAndWatchStub = spyOn(store, 'setAndWatch');
        orderUtils = require('utils/Order').default;
        getGlobalPromoCountStub = spyOn(orderUtils, 'getGlobalPromoCount').and.returnValue(true);
        isDesktopStub = spyOn(Sephora, 'isDesktop').and.returnValue(false);
        CheckoutPromoSection = require('components/Checkout/OrderSummary/CheckoutPromoSection/CheckoutPromoSection').default;
        const wrapper = shallow(<CheckoutPromoSection />);
        component = wrapper.instance();
        setStateStub = spyOn(component, 'setState');
    });

    it('should call isDesktop method', () => {
        expect(isDesktopStub).toHaveBeenCalled();
    });

    it('should call setAndWatch method', () => {
        expect(setAndWatchStub).toHaveBeenCalledTimes(1);
    });

    it('should call setAndWatch method with params', () => {
        // Arrange
        store.setAndWatch = setAndWatch;
        setAndWatchStub = spyOn(store, 'setAndWatch');

        // Act
        const wrapper = shallow(<CheckoutPromoSection />);

        // Assert
        component = wrapper.instance();
        expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
    });

    it('should call setState method of if condition of callback function', () => {
        const responseData = {
            orderDetails: {
                items: {
                    items: [{ productId: 'someId' }]
                },
                promotion: {
                    appliedPromotions: [{ promotionId: 'somePromotionId' }]
                }
            }
        };
        setAndWatchStub.calls.first().args[2](responseData);
        expect(setStateStub).toHaveBeenCalledTimes(1);
    });

    it('should call setState method of if condition of callback function with value', () => {
        const responseData = {
            orderDetails: {
                items: {
                    items: [{ productId: 'someId' }]
                },
                promotion: {
                    appliedPromotions: [{ promotionId: 'somePromotionId' }]
                }
            }
        };
        setAndWatchStub.calls.first().args[2](responseData);
        expect(setStateStub).toHaveBeenCalledWith({ showPromoSection: true });
    });

    it('should call getGlobalPromoCount function', () => {
        const responseData = {
            orderDetails: {
                items: {
                    items: [{ productId: 'someId' }]
                },
                promotion: { appliedPromotions: [] }
            }
        };
        setAndWatchStub.calls.first().args[2](responseData);
        expect(getGlobalPromoCountStub).toHaveBeenCalledTimes(1);
    });

    it('should call getGlobalPromoCount function with params', () => {
        const responseData = {
            orderDetails: {
                items: {
                    items: [{ productId: 'someId' }]
                },
                promotion: { appliedPromotions: [] }
            }
        };
        setAndWatchStub.calls.first().args[2](responseData);
        expect(getGlobalPromoCountStub).toHaveBeenCalledWith(responseData.orderDetails.items.items);
    });

    it('should call setState method of else condition', () => {
        const responseData = {
            orderDetails: {
                items: {
                    items: [{ productId: 'someId' }]
                },
                promotion: { appliedPromotions: [] }
            }
        };
        setAndWatchStub.calls.first().args[2](responseData);
        expect(setStateStub).toHaveBeenCalledTimes(1);
    });

    it('should call setState method of else condition with value', () => {
        const responseData = {
            orderDetails: {
                items: {
                    items: [{ productId: 'someId' }]
                },
                promotion: { appliedPromotions: [] }
            }
        };
        setAndWatchStub.calls.first().args[2](responseData);
        expect(setStateStub).toHaveBeenCalledWith({ showPromoSection: true });
    });
});
