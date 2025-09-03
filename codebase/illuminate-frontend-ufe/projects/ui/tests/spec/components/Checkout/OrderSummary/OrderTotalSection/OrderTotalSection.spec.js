/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;
const store = require('Store').default;
const OrderTotalSection = require('components/Checkout/OrderSummary/OrderTotalSection/OrderTotalSection').default;
const Actions = require('actions/Actions').default;
const localeUtils = require('utils/LanguageLocale').default;
const orderUtils = require('utils/Order').default;
const checkoutUtils = require('utils/Checkout').default;

describe('OrderTotalSection component', () => {
    let component;
    let wrapper;
    let showInfoModalStub;
    let showMediaModalStub;
    let dispatch;
    let dispatchStub;
    let isCanadaStub;
    let setAndWatch;
    let setAndWatchStub;

    beforeEach(() => {
        dispatch = store.dispatch;
        dispatchStub = spyOn(store, 'dispatch');
        setAndWatch = store.setAndWatch;
        setAndWatchStub = spyOn(store, 'setAndWatch');
        showInfoModalStub = spyOn(Actions, 'showInfoModal');
        showMediaModalStub = spyOn(Actions, 'showMediaModal');
        isCanadaStub = spyOn(localeUtils, 'isCanada').and.returnValue(false);
        spyOn(orderUtils, 'isZeroCheckout').and.returnValue(false);
        spyOn(checkoutUtils, 'isMoreThanJustCC').and.returnValue(true);
        spyOn(orderUtils, 'hasPromoCodes');
        wrapper = shallow(<OrderTotalSection />);
        component = wrapper.instance();
    });

    describe('Controller initialization', () => {
        let data;

        beforeEach(() => {
            data = {
                basketLevelMessages: [
                    {
                        type: 'warning',
                        messages: ['warning message']
                    }
                ]
            };
        });

        it('should call to setAndWatch', () => {
            // Arrange
            store.setAndWatch = setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');

            // Act
            wrapper = shallow(<OrderTotalSection />);
            component = wrapper.instance();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails.items.basketLevelMessages', component, any(Function));
        });

        it('should not update the state if has not warning messages', () => {
            const setStateStub = spyOn(component, 'setState');
            setAndWatchStub.calls.first().args[2]({ basket: {} });
            expect(setStateStub).not.toHaveBeenCalled();
        });

        it('should update the state if has warning messages', () => {
            const setStateStub = spyOn(component, 'setState');
            setAndWatchStub.calls.first().args[2](data);
            expect(setStateStub).toHaveBeenCalledWith({
                warningMessages: [
                    {
                        message: 'warning message',
                        messageContext: undefined
                    }
                ]
            });
        });
    });

    describe('on clicking the tax more info icon', () => {
        it('should dispatch showInfoModal action', () => {
            component.openInfoModal('title', 'message');
            expect(dispatchStub).toHaveBeenCalledWith(showInfoModalStub());
            expect(showInfoModalStub).toHaveBeenCalledWith({
                isOpen: true,
                title: 'title',
                message: 'message'
            });
        });
    });

    describe('on clicking the shipping & handling more info icon', () => {
        const shippingModalTitle = 'Shipping & Handling Information';
        it('should dispatch openMediaModal action', () => {
            // Arrange
            store.dispatch = dispatch;
            dispatchStub = spyOn(store, 'dispatch');

            // Act
            wrapper = shallow(<OrderTotalSection />);
            component = wrapper.instance();
            component.openMediaModal();
            isCanadaStub.and.returnValue(true);

            // Assert
            expect(dispatchStub).toHaveBeenCalledWith(showMediaModalStub(true, '15400038', shippingModalTitle, any(Function)));
            expect(showMediaModalStub).toHaveBeenCalledWith(true, '15400038', shippingModalTitle, any(Function));
        });

        it('should dispatch openMediaModal action', () => {
            // Arrange
            store.dispatch = dispatch;
            dispatchStub = spyOn(store, 'dispatch');

            // Act
            wrapper = shallow(<OrderTotalSection />);
            component = wrapper.instance();
            component.openMediaModal();
            isCanadaStub.and.returnValue(false);

            // Assert
            expect(dispatchStub).toHaveBeenCalledWith(showMediaModalStub(true, '18100078', shippingModalTitle, any(Function)));
            expect(showMediaModalStub).toHaveBeenCalledWith(true, '18100078', shippingModalTitle, any(Function));
        });

        it('should dispatch openMediaModal action', () => {
            // Arrange
            store.dispatch = dispatch;
            dispatchStub = spyOn(store, 'dispatch');

            // Act
            wrapper = shallow(<OrderTotalSection />);
            component = wrapper.instance();
            component.openMediaModal();
            isCanadaStub.and.returnValue(false);

            // Assert
            expect(dispatchStub).toHaveBeenCalledWith(showMediaModalStub(true, '15400036', shippingModalTitle, any(Function)));
            expect(showMediaModalStub).toHaveBeenCalledWith(true, '15400036', shippingModalTitle, any(Function));
        });
    });

    describe('should render data-at attribute set to', () => {
        it('"merch_subtotal_label"', () => {
            // Arrange
            const props = { priceInfo: { orderTotal: 'orderTotal' } };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'merch_subtotal_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"order_total_points_used_label"', () => {
            // Arrange
            const props = {
                priceInfo: { orderTotal: 'orderTotal' },
                items: { redeemedBiPoints: 10 }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'order_total_points_used_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_gc_ship_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    giftCardShipping: 'giftCardShipping'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_gc_ship_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_merch_ship_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    giftCardSubtotal: 'giftCardSubtotal',
                    merchandiseShipping: 'merchandiseShipping'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_merch_ship_label');

            expect(divElement.exists()).toBe(true);
        });

        it('"bsk_total_ship_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    totalShipping: 'totalShipping'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'bsk_total_ship_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"bag_fee_link"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    totalShipping: 'totalShipping',
                    bagFeeSubtotal: '1'
                },
                isBopis: true
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'bag_fee_link');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_gst_hst_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    goodsAndServicesTax: 'totalShipping'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);
            wrapper.setState({ isCanada: true });

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_gst_hst_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_pst_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    provincialSalesTax: '$5.00'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);
            wrapper.setState({ isCanada: true });

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_pst_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_credit_amt_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: '5.00',
                    storeCardAmount: 'storeCardAmount'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_credit_amt_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_gc_amt_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    giftCardAmount: 'giftCardAmount'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_gc_amt_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_egc_amt_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    eGiftCardAmount: 'eGiftCardAmount'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_egc_amt_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_cc_amt_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    creditCardAmount: 'creditCardAmount'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_cc_amt_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_paypal_amt_label"', () => {
            // Arrange
            const props = {
                priceInfo: {
                    orderTotal: 'orderTotal',
                    paypalAmount: 'paypalAmount'
                }
            };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_paypal_amt_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"tax_btn"', () => {
            // Arrange
            const props = { priceInfo: { orderTotal: 'orderTotal' } };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'tax_btn');
            expect(divElement.exists()).toBe(true);
        });

        it('"total_label"', () => {
            // Arrange
            const props = { priceInfo: { orderTotal: 'orderTotal' } };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'total_label');
            expect(divElement.exists()).toBe(true);
        });

        it('"order_summary_error_msg"', () => {
            // Arrange
            const props = { priceInfo: { orderTotal: 'orderTotal' } };

            // Act
            wrapper = shallow(<OrderTotalSection {...props} />);
            wrapper.setState({ warningMessages: 'warningMessages' });

            // Assert
            const divElement = wrapper.findWhere(n => n.prop('data-at') === 'order_summary_error_msg');
            expect(divElement.exists()).toBe(true);
        });
    });
});
