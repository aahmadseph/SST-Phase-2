/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { forms } from 'style/config';
import { Box, Divider, Link } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/FrictionlessCheckout/Payment/Display';
import agentAwareUtils from 'utils/AgentAware';
import SaveToAccountCheckbox from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Paypal/SaveToAccountCheckbox';

class PaypalRadio extends BaseClass {
    handlePayWithPayPalEditOnClick = () => {
        const { handlePayWithPayPalOnClick } = this.props;
        handlePayWithPayPalOnClick(true);
    };
    render() {
        const {
            isPayWithPayPal,
            paypalOption,
            handlePayWithPayPalOnClick,
            hasAutoReplenishItemInBasket,
            isZeroCheckout,
            isPayPalPayLaterEligible,
            fieldsetName,
            editPaypal,
            showSavePaypalCheckbox,
            hasSDUInBasket,
            orderHasPhysicalGiftCard
        } = this.props;

        return (
            <React.Fragment>
                <Box
                    className={agentAwareUtils.applyHideAgentAwareClass()}
                    ref={'paypal'}
                >
                    <Box
                        paddingTop={4}
                        {...(!paypalOption && { paddingBottom: 4 })}
                    >
                        <Radio
                            data-at={Sephora.debug.dataAt('paypal_radio')}
                            paddingY={0}
                            dotOffset={0}
                            alignItems='center'
                            name={fieldsetName || 'payWithPayPal'}
                            checked={isPayWithPayPal}
                            disabled={hasAutoReplenishItemInBasket || isZeroCheckout || hasSDUInBasket || orderHasPhysicalGiftCard}
                            onClick={handlePayWithPayPalOnClick}
                            isPaymentRadio
                        >
                            <PaymentDisplay
                                isPayPal
                                checkoutEnabled={!hasAutoReplenishItemInBasket || !orderHasPhysicalGiftCard}
                                paypalEmail={paypalOption && paypalOption.email}
                                isPayPalPayLaterEligible={isPayPalPayLaterEligible}
                                disabled={hasAutoReplenishItemInBasket || isZeroCheckout || hasSDUInBasket || orderHasPhysicalGiftCard}
                            />
                        </Radio>
                        {showSavePaypalCheckbox && isPayWithPayPal && (
                            <Box marginLeft={6}>
                                <SaveToAccountCheckbox />
                            </Box>
                        )}
                    </Box>

                    {paypalOption && (
                        <Box
                            display='flex'
                            marginLeft={forms.RADIO_SIZE + forms.RADIO_MARGIN + 'px'}
                            marginBottom={[1, null]}
                            marginTop={1}
                            paddingY={3}
                        >
                            <Link
                                paddingX={2}
                                margin={-2}
                                paddingY={1}
                                color='blue'
                                onClick={this.handlePayWithPayPalEditOnClick}
                            >
                                {editPaypal}
                            </Link>
                        </Box>
                    )}
                </Box>
                <Divider />
            </React.Fragment>
        );
    }
}

export default wrapComponent(PaypalRadio, 'PaypalRadio', true);
