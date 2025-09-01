/* eslint-disable no-unused-vars */
/* eslint max-len:[2,200] */
const React = require('react');
const ReactDOM = require('react-dom');
const { shallow } = require('enzyme');

xdescribe('Checkout Order Total Section JSX', () => {
    let component;
    let shallowComponent;
    let ReactTestUtils;
    let OrderTotalSection;
    let taxInfoElem;
    let orderUtils;

    const getOrderTotalSectionWrapper = (mount, compProps) => enzyme[mount ? 'mount' : 'shallow'](<OrderTotalSection {...compProps} />);
    let isZeroCheckoutStub;
    let hasPromoCodesStub;
    let shouldShowPromotionStub;

    beforeEach(() => {
        ReactTestUtils = require('react-dom/test-utils');
        OrderTotalSection = require('components/Checkout/OrderSummary/OrderTotalSection/OrderTotalSection').default;
        orderUtils = require('utils/Order').default;
        isZeroCheckoutStub = spyOn(orderUtils, 'isZeroCheckout');
        hasPromoCodesStub = spyOn(orderUtils, 'hasPromoCodes');
        shouldShowPromotionStub = spyOn(orderUtils, 'shouldShowPromotion');
    });

    describe('Place Order Button', () => {
        let placeOrderButtonComp;
        beforeEach(() => {
            const compProps = { priceInfo: { orderTotal: '$8.00' } };
            shallowComponent = getOrderTotalSectionWrapper(false, compProps);
            placeOrderButtonComp = shallowComponent.find('PlaceOrderButton');
        });

        it('should render the button', () => {
            expect(placeOrderButtonComp.length).toBe(1);
        });
    });

    describe('Shipping & Handling', () => {
        let compProps;

        describe('Shipping Available', () => {
            beforeEach(() => {
                compProps = {
                    priceInfo: {
                        orderTotal: '$10.00',
                        merchandiseShipping: '$3.00',
                        giftCardSubtotal: '$2.00'
                    }
                };
            });

            it('should render the value of Shipping & Handling', () => {
                shallowComponent = getOrderTotalSectionWrapper(false, compProps);
                const value = shallowComponent.find(`LegacyGridCell[children="${compProps.priceInfo.merchandiseShipping}"]`);
                expect(value.length).toBeGreaterThanOrEqual(1);
            });

            xit('should open the shipping Media modal', () => {
                shallowComponent = getOrderTotalSectionWrapper(true, compProps);
                const OrderTotalSectionInstance = shallowComponent.instance();
                const openMediaModalStub = spyOn(OrderTotalSectionInstance, 'openMediaModal');
                const ShippingHandlingBox = shallowComponent
                    .findWhere(node => node.name() === 'Box' && typeof node.prop('onClick') === 'function')
                    .at(0);
                ShippingHandlingBox.prop('onClick')();
                expect(openMediaModalStub).toHaveBeenCalled();
            });
        });

        describe('Shipping Not Available', () => {
            beforeEach(() => {
                compProps = {
                    priceInfo: {
                        orderTotal: '$10.00',
                        merchandiseShipping: null,
                        giftCardSubtotal: '$2.00'
                    }
                };
            });
            it('should render placeholder for S&H if there is no shipping yet', () => {
                const noShipppingYetText = '$-.--';
                shallowComponent = getOrderTotalSectionWrapper(false, compProps);
                const container = shallowComponent.find(`LegacyGridCell[children="${noShipppingYetText}"]`);
                expect(container.length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe('PromoSection', () => {
        let compProps;

        beforeEach(() => {
            compProps = { priceInfo: { orderTotal: '$8.00' } };
            spyOn(Sephora, 'isDesktop').and.returnValue(true);
        });

        it('should render PromoSection if util method returns true', () => {
            shouldShowPromotionStub.and.returnValue(true);
            shallowComponent = shallow(<OrderTotalSection {...compProps} />);
            expect(shallowComponent.find('CheckoutPromoSection').length).toBe(1);
        });

        it('should not render PromoSection if util method returns false', () => {
            shouldShowPromotionStub.and.returnValue(false);
            shallowComponent = shallow(<OrderTotalSection {...compProps} />);
            expect(shallowComponent.find('CheckoutPromoSection').length).toBe(0);
        });
    });

    describe('Price Info Render', () => {
        it('should not render the component if priceInfo is not ready', () => {
            component = getOrderTotalSectionWrapper(true, { priceInfo: null });
            expect(component.getDOMNode()).toEqual(null);
        });
        using(
            'Price Info',
            [
                {
                    label: 'Order total',
                    value: '$10.00',
                    currentState: { priceInfo: { orderTotal: '$10.00' } }
                },
                {
                    label: 'Discounts',
                    value: '-$5.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00',
                            promotionDiscount: '$5.00'
                        }
                    }
                },
                {
                    label: 'Gift Card Shipping',
                    value: '$4.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00',
                            giftCardShipping: '$4.00'
                        }
                    }
                },
                {
                    label: 'Merchandise Shipping',
                    value: '$3.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00',
                            merchandiseShipping: '$3.00',
                            giftCardSubtotal: '$2.00'
                        }
                    }
                },
                {
                    label: 'Merchandise subtotal',
                    value: '$8.00',
                    currentState: {
                        merchandiseTotal: '$8.00',
                        priceInfo: { orderTotal: '$8.00' }
                    }
                },
                {
                    label: 'Gift Wrap',
                    value: '$3.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00'
                        }
                    }
                },
                {
                    label: 'Account Credit',
                    value: '-$1.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00',
                            storeCardAmount: '$1.00'
                        }
                    }
                },
                {
                    label: 'Gift Card Redeemed',
                    value: '-$2.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00',
                            giftCardAmount: '$2.00'
                        }
                    }
                },
                {
                    label: 'eGift Card Redeemed',
                    value: '-$3.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00',
                            eGiftCardAmount: '$3.00'
                        }
                    }
                },
                {
                    label: 'PayPal Payment',
                    value: '$5.00',
                    currentState: {
                        priceInfo: {
                            orderTotal: '$10.00',
                            storeCardAmount: '$1.00',
                            paypalAmount: '$5.00'
                        }
                    }
                }
            ],
            config => {
                it('should render the value of ' + config.label, () => {
                    component = getOrderTotalSectionWrapper(true, config.currentState);
                    const textWrapper = component.find('LegacyGridCell');
                    let found = false;

                    for (let i = 0; i < textWrapper.length; i = i + 1) {
                        if (textWrapper.at(i).contains(config.label)) {
                            found = true;
                            expect(textWrapper.at(i + 1).text()).toEqual(config.value);

                            break;
                        }
                    }

                    expect(found).toEqual(true);
                });
            }
        );
    });

    describe('Order total before discount', () => {
        let compProps;

        describe('when orderTotalWithoutDiscount is defined', () => {
            beforeEach(() => {
                compProps = {
                    priceInfo: {
                        orderTotal: '$10.00',
                        orderTotalWithoutDiscount: '$2.00'
                    }
                };
                shallowComponent = shallow(<OrderTotalSection {...compProps} />);
            });

            it('should render a node with the order total without discount', () => {
                expect(shallowComponent.findWhere(n => n.text() === compProps.priceInfo.orderTotalWithoutDiscount).length).toBe(1);
            });

            it('should render a node with the order total', () => {
                expect(shallowComponent.findWhere(n => n.text() === compProps.priceInfo.orderTotal).length).toBe(1);
            });
        });

        describe('when orderTotalWithoutDiscount is undefined', () => {
            beforeEach(() => {
                compProps = { priceInfo: { orderTotal: '$10.00' } };
                shallowComponent = shallow(<OrderTotalSection {...compProps} />);
            });

            it('should render a single node with the order total', () => {
                component = getOrderTotalSectionWrapper(true, compProps);
                const textWrapper = component.find('Text');

                for (let i = 0; i < textWrapper.length; i = i + 1) {
                    if (textWrapper.at(i).contains('Order Total')) {
                        expect(textWrapper.at(i + 1).text()).toEqual(compProps.priceInfo.orderTotal);

                        break;
                    }
                }
            });
        });
    });

    describe('US Tax', () => {
        let usState;
        let taxValue;
        beforeEach(() => {
            usState = {
                isCanada: false,
                priceInfo: {
                    orderTotal: '$11.00',
                    merchandiseShipping: '$2.00',
                    tax: '$1.00'
                }
            };
            component = getOrderTotalSectionWrapper(true, usState);
            taxInfoElem = component.find('LegacyGrid').find('LegacyGridCell').find('button').at(1);
        });

        it('should render the value of US Tax', () => {
            taxValue = component.find('LegacyGrid').find('LegacyGridCell').find(`div[children="${usState.priceInfo.tax}"]`);
            expect(taxValue.length).toBe(1);
        });

        it('should open the modal with tax info', () => {
            const clickableBox = taxInfoElem;
            const showTaxInfoModal = spyOn(component.instance(), 'showTaxInfoModal');
            clickableBox.prop('onClick')();
            expect(showTaxInfoModal).toHaveBeenCalled();
        });

        it('should render placeholder for Tax if there is no shipping yet', () => {
            usState = {
                isCanada: false,
                priceInfo: {
                    orderTotal: '$11.00',
                    merchandiseShipping: null,
                    tax: '$1.00'
                }
            };
            component.setState(usState);
            taxInfoElem = component.find('LegacyGrid').find('LegacyGridCell').find('button').at(1);
            taxValue = component.find('LegacyGrid').find('LegacyGridCell').find(`div[children=${'"$1.00"'}]`);
            expect(taxValue.length).toBe(1);
        });
    });

    describe('For Canada', () => {
        let canadaState;
        let taxValue;
        describe('Shipping Not Available', () => {
            beforeEach(() => {
                canadaState = {
                    isCanada: true,
                    priceInfo: {
                        orderTotal: 'C$10.00',
                        merchandiseShipping: null,
                        goodsAndServicesTax: 'C$1.50',
                        provincialSalesTax: 'C$1.00'
                    }
                };
                component = getOrderTotalSectionWrapper(true, canadaState);
                taxInfoElem = component.find('LegacyGrid').find('LegacyGridCell').find('button').at(1);
            });

            it('should render placeholder for GST if there is no shipping yet', () => {
                taxValue = component.find('LegacyGrid').find('LegacyGridCell').find(`div[children=${'"C$-.--"'}]`);
                expect(taxValue.length).toBeGreaterThanOrEqual(1);
            });
        });

        describe('Shipping Not Available', () => {
            beforeEach(() => {
                canadaState = {
                    isCanada: true,
                    priceInfo: {
                        orderTotal: 'C$10.00',
                        merchandiseShipping: 'C$2.00',
                        goodsAndServicesTax: 'C$1.50',
                        provincialSalesTax: 'C$1.00'
                    }
                };
                component = getOrderTotalSectionWrapper(true, canadaState);
            });

            it('should hide US Tax information', () => {
                taxInfoElem = component.find('LegacyGrid').find('LegacyGridCell').find('button');
                expect(taxInfoElem.length).toBeLessThanOrEqual(1);
                expect(taxInfoElem.instance().innerText).not.toEqual('Tax');
            });

            it('should render the value of GST', () => {
                taxValue = component.find('LegacyGrid').find('LegacyGridCell').find(`div[children="${canadaState.priceInfo.goodsAndServicesTax}"]`);
                expect(taxValue.length).toBeGreaterThanOrEqual(1);
            });

            it('should render the value of PST', () => {
                taxValue = component.find('LegacyGrid').find('LegacyGridCell').find(`div[children="${canadaState.priceInfo.provincialSalesTax}"]`);
                expect(taxValue.length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe('ErrorMsg', () => {
        beforeEach(() => {
            const compProps = { priceInfo: { orderTotal: '$8.00' } };
            shallowComponent = shallow(<OrderTotalSection {...compProps} />);
        });

        it('should not render ErrorMsg component if the basket does not has warnings', () => {
            expect(shallowComponent.find('ErrorMsg').length).toBe(0);
        });

        it('should render ErrorMsg component if the basket has warnings', () => {
            shallowComponent.setState({ warningMessages: ['my warning'] });
            expect(shallowComponent.find('ErrorMsg').at(0).prop('children')).toEqual('my warning');
        });
    });

    describe('Points Used value', () => {
        let compProps;

        describe('when there are bi points redeemed in basket', () => {
            beforeEach(() => {
                compProps = {
                    priceInfo: { orderTotal: '$10.00' },
                    items: { redeemedBiPoints: '100' }
                };
                shallowComponent = shallow(<OrderTotalSection {...compProps} />);
            });

            it('should render a node with the value of the points redeemed', () => {
                expect(
                    shallowComponent.findWhere(n => n.key() === 'points-used' && n.children().text() === compProps.items.redeemedBiPoints).length
                ).toBe(1);
            });
        });

        describe('when there are zero bi points redeemed in basket', () => {
            beforeEach(() => {
                compProps = {
                    priceInfo: { orderTotal: '$10.00' },
                    items: { redeemedBiPoints: '0' }
                };
                shallowComponent = shallow(<OrderTotalSection {...compProps} />);
            });

            it('should not render a node with the value of the points redeemed', () => {
                expect(
                    shallowComponent.findWhere(n => n.key() === 'points-used' && n.children().text() === compProps.items.redeemedBiPoints).length
                ).toBe(0);
            });
        });
    });
});
