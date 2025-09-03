/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { forms } from 'style/config';
import { Box, Divider, Link } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/Checkout/Sections/Payment/Display/PaymentDisplay';
import agentAwareUtils from 'utils/AgentAware';
import { mediaQueries } from 'style/config';

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
            editPaypal
        } = this.props;

        return (
            <React.Fragment>
                <div
                    className={agentAwareUtils.applyHideAgentAwareClass()}
                    ref={'paypal'}
                    css={styles.paypalContainer}
                >
                    <Radio
                        data-at={Sephora.debug.dataAt('paypal_radio')}
                        dotOffset={0}
                        paddingY={3}
                        alignItems='center'
                        name={fieldsetName || 'payWithPayPal'}
                        checked={isPayWithPayPal}
                        disabled={hasAutoReplenishItemInBasket || isZeroCheckout}
                        onClick={handlePayWithPayPalOnClick}
                    >
                        <PaymentDisplay
                            isPayPal={true}
                            checkoutEnabled={!hasAutoReplenishItemInBasket}
                            paypalEmail={paypalOption && paypalOption.email}
                            isPayPalPayLaterEligible={isPayPalPayLaterEligible}
                        />
                    </Radio>
                    {paypalOption && (
                        <Box
                            marginLeft={forms.RADIO_SIZE + forms.RADIO_MARGIN + 'px'}
                            marginBottom={[3, null]}
                        >
                            <Link
                                padding={2}
                                margin={-2}
                                color='blue'
                                onClick={this.handlePayWithPayPalEditOnClick}
                            >
                                {editPaypal}
                            </Link>
                        </Box>
                    )}
                </div>
                <Divider marginBottom={[0, 3]} />
            </React.Fragment>
        );
    }
}

const styles = {
    paypalContainer: {
        [mediaQueries.md]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }
    }
};

export default wrapComponent(PaypalRadio, 'PaypalRadio', true);
