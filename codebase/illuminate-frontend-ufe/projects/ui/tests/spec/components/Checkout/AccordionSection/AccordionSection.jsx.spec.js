const React = require('react');
const { shallow } = require('enzyme');
const localeUtils = require('utils/LanguageLocale').default;
const AccordionSection = require('components/Checkout/AccordionSection/AccordionSection').default;

describe('AccordionSection component', () => {
    beforeEach(() => {
        // Arrange
        spyOn(Sephora, 'isMobile').and.returnValue(false);
        spyOn(localeUtils, 'isCanada').and.returnValue(false);
    });

    describe('should render data-at attribute for', () => {
        using(
            'root container',
            [
                {
                    dataAt: 'reviewSubmitSubscribeTitle',
                    value: 'checkout_review_and_subscribe'
                },
                {
                    dataAt: 'reviewSubmitEditsTitle',
                    value: 'checkout_review_and_submit_edits'
                },
                {
                    dataAt: 'shippingDelivery',
                    value: 'checkout_shipping_and_delivery'
                },
                {
                    dataAt: 'reviewPlaceOrder',
                    value: 'checkout_review_and_place_order'
                },
                {
                    dataAt: 'accountCreation',
                    value: 'checkout_account_creation'
                },
                {
                    dataAt: 'paymentMethod',
                    value: 'checkout_payment_method'
                },
                {
                    dataAt: 'deliveryGiftOptions',
                    value: 'checkout_delivery_and_gift_options'
                },
                {
                    dataAt: 'shippingAddress',
                    value: 'checkout_shipping_address'
                },
                {
                    dataAt: 'giftCardDeliveryMessage',
                    value: 'checkout_gift_card_delivery_and_message'
                },
                {
                    dataAt: 'giftCardShippingAddress',
                    value: 'checkout_gift_card_shipping_address'
                }
            ],
            config => {
                it('for ' + config.dataAt, () => {
                    // Act
                    const wrapper = shallow(<AccordionSection {...config} />);

                    // Assert
                    expect(wrapper.find(`[data-at="${Sephora.debug.dataAt(config.value)}"]`).exists()).toEqual(true);
                });
            }
        );

        it('title text element', () => {
            // Arrange
            const props = { dataAtSectionTitle: 'dataAtSectionTitle' };

            // Act
            const wrapper = shallow(<AccordionSection {...props} />);
            const textElement = wrapper.find(`[data-at="${props.dataAtSectionTitle}"]`);

            // Assert
            expect(textElement.exists()).toBe(true);
        });

        it('message text element', () => {
            // Arrange
            const props = {
                dataAtMessage: 'dataAtMessage',
                message: 'message',
                isOpen: true
            };

            // Act
            const wrapper = shallow(<AccordionSection {...props} />);
            const textElement = wrapper.find(`[data-at="${props.dataAtMessage}"]`);

            // Assert
            expect(textElement.exists()).toBe(true);
        });
    });
});
