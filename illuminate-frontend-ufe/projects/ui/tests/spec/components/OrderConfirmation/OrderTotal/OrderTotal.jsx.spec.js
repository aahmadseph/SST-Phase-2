const React = require('react');
const { shallow } = require('enzyme');

describe('OrderTotal component', () => {
    let CheckoutUtils;
    let OrderTotal;

    beforeEach(() => {
        CheckoutUtils = require('utils/Checkout').default;
        OrderTotal = require('components/OrderConfirmation/OrderTotal/OrderTotal').default;
    });

    describe('render', () => {
        it('should render as null if no priceInfo is provided', () => {
            const shallowComponent = shallow(<OrderTotal />);
            expect(shallowComponent.html()).toEqual(null);
        });

        it('should render as null if no orderTotal or shipmentTotal are provided', () => {
            const shallowComponent = shallow(<OrderTotal priceInfo={{}} />);
            expect(shallowComponent.html()).toEqual(null);
        });

        describe('when in US', () => {
            const props = {
                priceInfo: {
                    creditCardAmount: '$193.37',
                    merchandiseShipping: 'FREE',
                    merchandiseSubtotal: '$169.00',
                    orderTotal: '$183.37',
                    shipmentTotal: '$183.37',
                    profileLocale: 'US',
                    profileStatus: 4,
                    promotionDiscount: '$20.00',
                    tax: '$14.37',
                    totalShipping: 'FREE'
                },
                isOrderDetail: true
            };
            let shallowComponent;

            beforeEach(() => {
                shallowComponent = shallow(<OrderTotal {...props} />);
            });

            it('should render Merchandise Subtotal', () => {
                const element = shallowComponent.findWhere(
                    n =>
                        n.name() === 'Grid' &&
                        n.childAt(0).text() === 'Merchandise Subtotal' &&
                        n.childAt(1).text() === props.priceInfo.merchandiseSubtotal
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Merchandise Subtotal label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_merch_subtotal')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render Shipping & Handling', () => {
                spyOn(CheckoutUtils, 'setShippingFee').and.callFake(e => e);
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'Shipping & Handling' && n.childAt(1).text() === props.priceInfo.totalShipping
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Shipping & Handling label data-at', () => {
                spyOn(CheckoutUtils, 'setShippingFee').and.callFake(e => e);
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_shipping')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render Discounts', () => {
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'Discounts' && n.childAt(1).text() === `-${props.priceInfo.promotionDiscount}`
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Discounts label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_discounts')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render Tax', () => {
                const element = shallowComponent.findWhere(n => n.name() === 'Grid' && n.childAt(0).text() === 'Tax');
                expect(element.exists()).toBe(true);
            });

            it('should render Tax label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_tax')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render Tax from State Tax', () => {
                const newProps = { priceInfo: Object.assign({ stateTax: '$15.37' }, props.priceInfo) };
                delete newProps.priceInfo.tax;

                shallowComponent.setProps(newProps);

                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'Tax' && n.childAt(1).text() === newProps.priceInfo.stateTax
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Tax as default', () => {
                delete props.priceInfo.tax;

                shallowComponent.setProps(props);

                const element = shallowComponent.findWhere(n => n.name() === 'Grid' && n.childAt(0).text() === 'Tax');
                expect(element.exists()).toBeTruthy();
            });

            it('should render Order Total', () => {
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'Order Total' && n.childAt(1).text() === props.priceInfo.shipmentTotal
                );
                expect(element.exists()).toBeTruthy();
            });
            it('should render Order Total label data-at', () => {
                /*const element = shallowComponent.findWhere(
                    n => n.name() === 'LegacyGrid' && n.childAt(0).childAt(0).text() === 'Order Total'
                    && n.childAt(0).childAt(0).prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_order_total')}`);*/
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_order_total')}`);
                expect(element.exists).toBeTruthy();
            });
        });

        describe('when in Canada', () => {
            const props = {
                priceInfo: {
                    creditCardAmount: '49,66 $',
                    goodsAndServicesTax: '0,00 $',
                    harmonizedSalesTax: '5,71 $',
                    merchandiseShipping: '7,95 $',
                    merchandiseSubtotal: '36,00 $',
                    orderTotal: '49,66 $',
                    profileLocale: 'CA',
                    profileStatus: 4,
                    provincialSalesTax: '1,00 $',
                    tax: '5,71 $',
                    totalShipping: '7,95 $'
                },
                orderLocale: 'CA',
                isOrderDetail: true
            };

            let shallowComponent;
            beforeEach(() => {
                shallowComponent = shallow(<OrderTotal {...props} />);
            });

            it('should render GST/HST', () => {
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'GST/HST' && n.childAt(1).text() === props.priceInfo.harmonizedSalesTax
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render GST/HST label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_hst')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render PST', () => {
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'PST' && n.childAt(1).text() === props.priceInfo.provincialSalesTax
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render PST label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_pst')}`);
                expect(element.exists()).toBeTruthy();
            });
        });

        describe('when in more than just CC', () => {
            const props = {
                priceInfo: {
                    creditCardAmount: '$193.37',
                    merchandiseShipping: 'FREE',
                    merchandiseSubtotal: '$169.00',
                    orderTotal: '$183.37',
                    profileLocale: 'US',
                    profileStatus: 4,
                    promotionDiscount: '$20.00',
                    tax: '$14.37',
                    totalShipping: 'FREE',
                    storeCardAmount: '$1.00',
                    giftCardAmount: '$2.00',
                    eGiftCardAmount: '$3.00',
                    paypalAmount: '$5.00'
                },
                isOrderDetail: true
            };
            let shallowComponent;

            beforeEach(() => {
                spyOn(CheckoutUtils, 'isMoreThanJustCC').and.returnValue(true);
                shallowComponent = shallow(<OrderTotal {...props} />);
            });

            it('should render Account Credit', () => {
                const element = shallowComponent.findWhere(
                    n =>
                        n.name() === 'Grid' &&
                        n.childAt(0).text() === 'Account Credit' &&
                        n.childAt(1).text() === `-${props.priceInfo.storeCardAmount}`
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Account Credit label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_store_credit')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render Gift Card Redeemed', () => {
                const element = shallowComponent.findWhere(
                    n =>
                        n.name() === 'Grid' &&
                        n.childAt(0).text() === 'Gift Card Redeemed' &&
                        n.childAt(1).text() === `-${props.priceInfo.giftCardAmount}`
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Gift Card Redeemed label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_gc_redeemed')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render eGift Card Redeemed', () => {
                const element = shallowComponent.findWhere(
                    n =>
                        n.name() === 'Grid' &&
                        n.childAt(0).text() === 'eGift Card Redeemed' &&
                        n.childAt(1).text() === `-${props.priceInfo.eGiftCardAmount}`
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Credit Card Payment', () => {
                const element = shallowComponent.findWhere(
                    n =>
                        n.name() === 'Grid' &&
                        n.childAt(0).text() === 'Credit Card Payment' &&
                        n.childAt(1).text() === `${props.priceInfo.creditCardAmount}`
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Credit Card Payment label data-at', () => {
                const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('orderdetail_label_cc_payment')}`);
                expect(element.exists()).toBeTruthy();
            });

            it('should render PayPal Payment', () => {
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'PayPal Payment' && n.childAt(1).text() === props.priceInfo.paypalAmount
                );
                expect(element.exists()).toBeTruthy();
            });
        });

        describe('when is not order detail Canada', () => {
            const props = {
                priceInfo: {
                    creditCardAmount: '49,66 $',
                    goodsAndServicesTax: '0,00 $',
                    harmonizedSalesTax: '5,71 $',
                    merchandiseShipping: '7,95 $',
                    merchandiseSubtotal: '36,00 $',
                    orderTotal: '49,66 $',
                    profileLocale: 'CA',
                    profileStatus: 4,
                    provincialSalesTax: '1,00 $',
                    tax: '5,71 $',
                    totalShipping: '7,95 $'
                },
                orderLocale: 'CA'
            };

            let shallowComponent;
            beforeEach(() => {
                shallowComponent = shallow(<OrderTotal {...props} />);
            });

            it('should render Estimated GST/HST', () => {
                const element = shallowComponent.findWhere(
                    n =>
                        n.name() === 'Grid' &&
                        n.childAt(0).text() === 'Estimated GST/HST' &&
                        n.childAt(1).text() === props.priceInfo.harmonizedSalesTax
                );
                expect(element.exists()).toBeTruthy();
            });

            it('should render Estimated PST', () => {
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'Estimated PST' && n.childAt(1).text() === props.priceInfo.provincialSalesTax
                );
                expect(element.exists()).toBeTruthy();
            });
        });

        describe('when is not order detail US', () => {
            const props = {
                priceInfo: {
                    creditCardAmount: '$193.37',
                    merchandiseShipping: 'FREE',
                    merchandiseSubtotal: '$169.00',
                    orderTotal: '$183.37',
                    profileLocale: 'US',
                    profileStatus: 4,
                    promotionDiscount: '$20.00',
                    tax: '$14.37',
                    totalShipping: 'FREE'
                }
            };
            let shallowComponent;

            beforeEach(() => {
                shallowComponent = shallow(<OrderTotal {...props} />);
            });

            it('should render Estimated Tax', () => {
                const element = shallowComponent.findWhere(
                    n => n.name() === 'Grid' && n.childAt(0).text() === 'Estimated Tax' && n.childAt(1).text() === props.priceInfo.tax
                );
                expect(element.exists()).toBeTruthy();
            });
        });
    });
});
