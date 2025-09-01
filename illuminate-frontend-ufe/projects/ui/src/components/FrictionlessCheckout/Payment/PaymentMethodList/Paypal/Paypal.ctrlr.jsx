import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import PaypalRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PaypalRadio';
import Debounce from 'utils/Debounce';
import checkoutUtils from 'utils/Checkout';
import OrderUtils from 'utils/Order';
import PayPal from 'utils/PayPal';
import Location from 'utils/Location';
import { PAYMENT_LOGO_SIZE } from 'components/Checkout/constants';
import PaymentLogo from 'components/FrictionlessCheckout/Payment/PaymentLogo';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';

import { Box, Grid, Text } from 'components/ui';

const PAYMENT_FLAGS = 'isPayWithPayPal';

class Paypal extends BaseClass {
    componentDidMount() {
        if (this.props.isPayPalEnabled && this.props.priceInfo) {
            PayPal.preparePaypalCheckout();
        }
    }

    handlePayWithPayPalOnClick = Debounce.preventDoubleClick(() => {
        const { isGUestOrder } = this.props;

        if (OrderUtils.containsRestrictedItem()) {
            this.props.setCheckoutSectionErrors({ paymentMethod: this.props.localization.paypalRestrictedItemError });

            return;
        }

        if (!this.props.paypalOption) {
            PayPal.showPayPal(payload => {
                this.props.payPalWithInterstice(payload).then(() => {
                    const { commonOrderToggleActions, sectionSaveOrderAction, callback, updatePaymentActions } = this.props;

                    commonOrderToggleActions();
                    updatePaymentActions();
                    sectionSaveOrderAction(Location.getLocation().pathname, this);
                    refreshCheckout()().then(() => {
                        callback(false);
                    });

                    if (isGUestOrder) {
                        this.props.switchPaymentState(PAYMENT_FLAGS);
                    }
                });
            });
        } else {
            this.props.switchPaymentState(PAYMENT_FLAGS);

            if (isGUestOrder) {
                checkoutUtils.disablePlaceOrderButtonBasedOnCheckoutCompleteness();
            }
        }

        this.props.processPaymentClickEvent('checkout:express-payment:paypal');
    });

    renderText = () => {
        const { email } = this.props.payPalPaymentGroup;
        const {
            payPalAccount, payNow, or, payLaterWithPayPal, payWithPayPal
        } = this.props.localization;

        return email ? (
            <Text is='p'>{payPalAccount}</Text>
        ) : this.props.isPayPalPayLaterEligible ? (
            <>
                <Text
                    is='p'
                    fontWeight='bold'
                >
                    {payNow}
                    <Text
                        is='span'
                        fontWeight='normal'
                    >
                        {' '}
                        {or}{' '}
                    </Text>
                    {payLaterWithPayPal}
                </Text>
            </>
        ) : (
            <Text
                is='p'
                fontWeight='bold'
            >
                {payWithPayPal}
            </Text>
        );
    };

    displayPayment = () => {
        const { email } = this.props.payPalPaymentGroup;

        return (
            <Grid
                columns='auto 1fr'
                gap={3}
                alignItems='center'
                lineHeight='tight'
                data-at={Sephora.debug.dataAt('pay_pal_section')}
            >
                <PaymentLogo
                    {...PAYMENT_LOGO_SIZE}
                    style={{ alignSelf: 'flex-start' }}
                    paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.PAYPAL}
                />
                <div>
                    <Box marginBottom='-2px'>{this.renderText()}</Box>
                    {email && (
                        <>
                            <Text
                                is='span'
                                data-at={Sephora.debug.dataAt('paypal_email')}
                            >
                                {email}
                            </Text>
                        </>
                    )}
                </div>
            </Grid>
        );
    };

    render() {
        const {
            hasAutoReplenishItemInBasket,
            isPayPalSelected,
            isZeroCheckout,
            paymentOptions,
            isPayPalPayLaterEligible,
            isPayPalEnabled,
            payPalPaymentGroup,
            showSavePaypalCheckbox,
            hasSDUInBasket,
            orderHasPhysicalGiftCard
        } = this.props;

        if (payPalPaymentGroup && payPalPaymentGroup.isComplete) {
            return this.displayPayment();
        }

        return isPayPalEnabled || hasAutoReplenishItemInBasket || hasSDUInBasket || orderHasPhysicalGiftCard ? (
            <PaypalRadio
                ref={'paypal'}
                isZeroCheckout={isZeroCheckout}
                isPayWithPayPal={isPayPalSelected}
                paypalOption={paymentOptions.paypal}
                handlePayWithPayPalOnClick={this.handlePayWithPayPalOnClick}
                hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                hasSDUInBasket={hasSDUInBasket}
                isPayPalPayLaterEligible={isPayPalPayLaterEligible}
                fieldsetName='paymentMethodGroup'
                showSavePaypalCheckbox={showSavePaypalCheckbox}
                orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
            />
        ) : null;
    }
}

export default wrapComponent(Paypal, 'Paypal', true);
