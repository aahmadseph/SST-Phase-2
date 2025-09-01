const React = require('react');
const { objectContaining, any } = jasmine;
const { shallow } = require('enzyme');

describe('CheckoutMain component', () => {
    let CheckoutMain;
    let checkoutUtils;
    let localeUtils;
    let orderUtils;
    let getText;
    let shallowComponent;
    let orderDetails;

    const shallowRender = (props = {}) => {
        props.getCallsCounter = 1;
        shallowComponent = shallow(<CheckoutMain {...props} />);

        return shallowComponent;
    };

    beforeEach(() => {
        CheckoutMain = require('components/Checkout/CheckoutMain').default;
        checkoutUtils = require('utils/Checkout').default;
        localeUtils = require('utils/LanguageLocale').default;
        orderUtils = require('utils/Order').default;
        getText = localeUtils.getLocaleResourceFile('components/Checkout/locales', 'CheckoutMain');
        Sephora.analytics = { initialLoadDependencies: [] };

        orderDetails = {
            isInitialized: true,
            header: {
                isComplete: false,
                profile: {}
            },
            items: { items: [] },
            priceInfo: {},
            shippingGroups: { shippingGroupsEntries: [] },
            paymentGroups: { paymentGroupsEntries: [] }
        };
        spyOn(CheckoutMain.prototype, 'componentDidMount');
    });

    it('CheckoutMain title for DC flow', () => {
        // Arrange
        shallowRender();
        shallowComponent.setState({ orderDetails: { header: { isBopisOrder: false } } });

        // Act
        const title = shallowComponent.findWhere(n => n.name() === 'Text' && n.prop('is') === 'h1' && n.prop('children') === getText('checkout'));

        // Assert
        expect(title.length).toEqual(1);
    });

    it('CheckoutMain title for BOPIS flow', () => {
        // Arrange
        shallowRender();
        shallowComponent.setState({ orderDetails: { header: { isBopisOrder: true } } });

        // Act
        const title = shallowComponent.findWhere(
            n => n.name() === 'Text' && n.prop('is') === 'h1' && n.prop('children') === getText('pickupOrderCheckout')
        );

        // Assert
        expect(title.length).toEqual(1);
    });

    it('should render left region as BccComponentList if passed passed', () => {
        const regionsLeft = ['one', 'two'];
        shallowRender({ regions: { left: regionsLeft } });
        expect(shallowComponent.find('BccComponentList').at(0).prop('items')).toEqual(regionsLeft);
    });

    it('should render Logo coponent', () => {
        expect(shallowRender().find('Logo').length).toEqual(1);
    });

    describe('should render OrderSummary component', () => {
        it('for guest checkout on mweb', () => {
            // Arrange
            spyOn(Sephora, 'isMobile').and.returnValue(true);

            // Act
            const wrapper = shallow(<CheckoutMain />);

            // Assert
            const OrderSummary = wrapper.find('Connect(OrderSummary)');
            expect(OrderSummary.exists()).toBeTruthy();
        });

        it('for DT', () => {
            // Arrange
            spyOn(Sephora, 'isMobile').and.returnValue(false);

            // Act
            const wrapper = shallow(<CheckoutMain />);

            // Assert
            const OrderSummary = wrapper.find('LegacyGrid Connect(OrderSummary)');
            expect(OrderSummary.exists()).toBeTruthy();
        });
    });

    it('should call getCheckoutAccordion if order is initialized', () => {
        shallowRender();
        const getCheckoutAccordionStub = spyOn(shallowComponent.instance(), 'getCheckoutAccordion');
        shallowComponent.setState({ orderDetails });
        expect(getCheckoutAccordionStub).toHaveBeenCalledTimes(1);
    });

    describe('getCheckoutAccordion', () => {
        let checkoutAccordionConfigurationStub;
        let response;
        let shipOptionsSection;
        let reviewSection;

        const getSection = (index, state = null) => {
            if (state) {
                shallowComponent.setState(state);
                response = shallowComponent.instance().getCheckoutAccordion();
            }

            return shallowComponent.wrap(response[index]);
        };

        beforeEach(() => {
            shipOptionsSection = {
                title: 'shippingDelivery',
                name: checkoutUtils.CHECKOUT_SECTIONS.SHIP_OPTIONS.name,
                components: {
                    message: 'msg',
                    focus: 'focus',
                    unfocus: 'unfocus'
                }
            };

            reviewSection = {
                title: 'shippingDelivery',
                name: checkoutUtils.CHECKOUT_SECTIONS.REVIEW.name,
                components: {
                    message: 'review_msg',
                    focus: 'review_focus',
                    unfocus: 'review_unfocus'
                },
                component: 'review_child_component!'
            };
            spyOn(orderUtils, 'hasAutoReplenishItems').and.returnValue(false);
            spyOn(orderUtils, 'allItemsInBasketAreReplen').and.returnValue(false);
            shallowRender();
            shallowComponent.setState({
                isNewUserFlow: true,
                focus: { isInitialized: false },
                orderDetails,
                orderHasReplen: false,
                allItemsAreReplen: false
            });

            const inst = shallowComponent.instance();
            checkoutAccordionConfigurationStub = spyOn(inst, 'checkoutAccordionConfiguration').and.returnValue([shipOptionsSection, reviewSection]);
            response = inst.getCheckoutAccordion();
        });

        it('should call checkoutAccordionConfiguration with correct args', () => {
            expect(checkoutAccordionConfigurationStub).toHaveBeenCalledWith(orderDetails, true, false, false);
        });

        it('should return array of correct size', () => {
            expect(response.length).toEqual(2);
        });

        describe('for regular section', () => {
            let shipOptionsComp;

            beforeEach(() => {
                shipOptionsComp = getSection(0);
            });

            it('should be AccordionSection', () => {
                expect(shipOptionsComp.is('AccordionSection')).toEqual(true);
            });

            it('should pass a name property', () => {
                expect(shipOptionsComp.prop('name')).toEqual(checkoutUtils.CHECKOUT_SECTIONS.SHIP_OPTIONS.name);
            });

            it('should pass a message property', () => {
                expect(shipOptionsComp.prop('message')).toEqual('msg');
            });

            describe('focus state', () => {
                beforeEach(() => {
                    shipOptionsComp = getSection(0, { focus: { isInitialized: true } });
                });

                it('should contain unfocused component by default', () => {
                    expect(shipOptionsComp.prop('children')).toEqual('unfocus');
                });

                it('should contain focused component if present in state', () => {
                    shipOptionsComp = getSection(0, {
                        focus: {
                            isInitialized: true,
                            shipOptions: true
                        }
                    });
                    expect(shipOptionsComp.prop('children')).toEqual('focus');
                });
            });
        });

        describe('for review section', () => {
            let reviewComp;
            beforeEach(() => {
                reviewComp = getSection(1);
            });

            it('should be AccordionSection', () => {
                expect(reviewComp.is('AccordionSection')).toEqual(true);
            });

            it('should contain child component', () => {
                expect(reviewComp.prop('children')).toEqual('review_child_component!');
            });
        });
    });

    describe('checkoutAccordionConfiguration', () => {
        let getPhysicalGiftCardShippingGroupStub;
        let isGuestOrderStub;
        let isZeroCheckoutStub;
        let getHardGoodShippingGroupStub;
        let response;

        const findSection = (name, isNewUserFlow = false) => {
            response = shallowComponent.instance().checkoutAccordionConfiguration(orderDetails, isNewUserFlow);

            for (const section of response) {
                if (section.name === name) {
                    if (section.components && section.components.focus) {
                        section.components.focus = shallowComponent.wrap(section.components.focus);
                    }

                    if (section.components && section.components.unfocus) {
                        section.components.unfocus = shallowComponent.wrap(section.components.unfocus);
                    }

                    if (section.component) {
                        section.component = shallowComponent.wrap(section.component);
                    }

                    return section;
                }
            }

            return null;
        };

        const sectionComponentsStub = {
            focus: any(Object),
            unfocus: any(Object)
        };

        beforeEach(() => {
            getPhysicalGiftCardShippingGroupStub = spyOn(orderUtils, 'getPhysicalGiftCardShippingGroup');
            getPhysicalGiftCardShippingGroupStub.and.returnValue(false);
            isZeroCheckoutStub = spyOn(orderUtils, 'isZeroCheckout').and.returnValue(false);
            spyOn(orderUtils, 'isShippableOrder').and.returnValue(true);
            spyOn(orderUtils, 'isPayPalEnabled').and.returnValue(true);

            getHardGoodShippingGroupStub = spyOn(orderUtils, 'getHardGoodShippingGroup');
            getHardGoodShippingGroupStub.and.returnValue({
                isComplete: true,
                shippingMethod: { isComplete: true }
            });
            spyOn(orderUtils, 'allowUpdatedShippingCalculationsMsg').and.returnValue(true);

            spyOn(orderUtils, 'getGiftCardPaymentGroups').and.returnValue({ isComplete: false });
            spyOn(orderUtils, 'userHasSavedPayPalAccount').and.returnValue(false);
            spyOn(orderUtils, 'hasRRC').and.returnValue(false);

            isGuestOrderStub = spyOn(checkoutUtils, 'isGuestOrder').and.returnValue(false);
            shallowRender();
            shallowComponent.setState({
                orderShippingMethods: [],
                paymentOptions: {
                    creditCards: [],
                    paypal: {}
                },
                orderDetails,
                isNewUserFlow: false
            });
        });

        describe('shipping for gift cards', () => {
            beforeEach(() => {
                getPhysicalGiftCardShippingGroupStub.and.returnValue({ shippingMethod: { isComplete: true } });
            });

            it('should contain giftCardShipAddress', () => {
                const giftCardShipAddress = findSection(checkoutUtils.CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS.name);
                expect(giftCardShipAddress.components).toEqual(objectContaining(sectionComponentsStub));
            });

            it('should contain giftCardShipOptions', () => {
                const giftCardShipOptions = findSection(checkoutUtils.CHECKOUT_SECTIONS.GIFT_CARD_OPTIONS.name);
                expect(giftCardShipOptions.components).toEqual(objectContaining(sectionComponentsStub));
            });
        });

        describe('shipping for hard good items', () => {
            it('should not contain giftCard sections', () => {
                const giftCardShipAddress = findSection(checkoutUtils.CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS.name);
                expect(giftCardShipAddress).toEqual(null);
            });

            it('should contain shipAddressSection', () => {
                const shipAddressSection = findSection(checkoutUtils.CHECKOUT_SECTIONS.SHIP_ADDRESS.name);
                expect(shipAddressSection.components).toEqual(objectContaining(sectionComponentsStub));
            });
            it('should contain ShipOptionsForm', () => {
                const ShipOptionsForm = findSection(checkoutUtils.CHECKOUT_SECTIONS.SHIP_OPTIONS.name);
                expect(ShipOptionsForm.components).toEqual(objectContaining(sectionComponentsStub));
            });
        });

        describe('payment section', () => {
            const getPaymentSection = () => {
                return findSection(checkoutUtils.CHECKOUT_SECTIONS.PAYMENT.name);
            };

            it('should be present for regular checkout', () => {
                const paymentSection = getPaymentSection();
                expect(paymentSection.components).toEqual(objectContaining(sectionComponentsStub));
            });

            describe('zero checkout', () => {
                beforeEach(() => {
                    isZeroCheckoutStub.and.returnValue(true);
                });

                it('should not be present for regular orders', () => {
                    const paymentSection = getPaymentSection();
                    expect(paymentSection).toEqual(null);
                });
            });
        });

        describe('account section', () => {
            const getAccountSection = (isNewUserFlow = false) => {
                return findSection(checkoutUtils.CHECKOUT_SECTIONS.ACCOUNT.name, isNewUserFlow);
            };

            beforeEach(() => {
                isGuestOrderStub.and.returnValue(false);
            });

            it('should not be present for existing users', () => {
                const accountSection = getAccountSection();
                expect(accountSection).toEqual(null);
            });

            it('should not be present for guest checkout users', () => {
                isGuestOrderStub.and.returnValue(true);
                const accountSection = getAccountSection();
                expect(accountSection).toEqual(null);
            });

            it('should be present for new users', () => {
                const accountSection = getAccountSection(true);
                expect(accountSection.components).toEqual(objectContaining(sectionComponentsStub));
            });
        });

        describe('review section', () => {
            it('should not be present for guest checkout', () => {
                // Arrange
                isGuestOrderStub.and.returnValue(true);

                // Act
                const reviewSection = findSection(checkoutUtils.CHECKOUT_SECTIONS.REVIEW.name);

                // Assert
                expect(reviewSection).toEqual(null);
            });

            it('should be present for non applePay regular flow', () => {
                // Act
                const reviewSection = findSection(checkoutUtils.CHECKOUT_SECTIONS.REVIEW.name);

                // Assert
                expect(reviewSection.component.is('ReviewText')).toEqual(true);
            });

            it('should not be present for applePay flow', () => {
                // Arrange
                shallowComponent.setState({ isApplePayFlow: true });

                // Act
                const reviewSection = findSection(checkoutUtils.CHECKOUT_SECTIONS.REVIEW.name);

                // Assert
                expect(reviewSection).toEqual(null);
            });
        });
    });
});
