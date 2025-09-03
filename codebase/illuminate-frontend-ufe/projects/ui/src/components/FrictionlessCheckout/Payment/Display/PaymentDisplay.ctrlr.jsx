/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Grid, Text } from 'components/ui';
import PaymentLogo from 'components/RwdCheckout/PaymentLogo/PaymentLogo';
import OrderUtils from 'utils/Order';
import SaveToAccountCheckbox from 'components/RwdCheckout/Shared/PayPal';
import creditCardUtils from 'utils/CreditCard';
import StringUtils from 'utils/String';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import { PAYMENT_LOGO_SIZE } from 'components/RwdCheckout/constants';
import { colors } from 'style/config';
import { PAYMENT_TYPES } from 'constants/RwdBasket';

const { getPaymentSectionProps, paymentServices } = FrictionlessUtils;

const PAYMENT_NAME = {
    payWithKlarna: 'Klarna',
    payWithAfterpay: 'Afterpay',
    payWithPaze: 'Pay with Paze',
    payWithVenmo: 'Pay with Venmo'
};

const VENMO = 'Venmo';

class PaymentDisplay extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isComplete: false
        };
    }

    componentDidMount() {
        const state = {};

        /*jshint ignore:start*/
        if (Object.keys(state).length !== 0) {
            this.setState({ ...state });
        }
        /*jshint ignore:end*/
    }

    getDisabledMessage = ({ sectionProps }) => {
        const {
            paymentName,
            locales: { paymentDisabled, venmoDisabled, pazePaymentDisabled }
        } = this.props;

        if (paymentName === PAYMENT_TYPES.PAY_VENMO) {
            return venmoDisabled;
        }

        if (paymentName === PAYMENT_TYPES.PAY_PAZE) {
            return pazePaymentDisabled;
        }

        return StringUtils.format(paymentDisabled, sectionProps.paymentService, sectionProps.limit);
    };

    renderPaymentService = ({ sectionProps }) => {
        const {
            defaultPayment, paymentName, installmentValue, isSaveState, disabled, username
        } = this.props;
        const paymentIsDefault = defaultPayment && paymentName?.toLowerCase().includes(defaultPayment);
        const isPaze = paymentServices.payWithPaze.paymentName === paymentName;
        const isVenmo = paymentName === PAYMENT_TYPES.PAY_VENMO;
        const isAfterpay = paymentName === PAYMENT_TYPES.PAY_AFTERPAY;
        const isKlarna = paymentName === PAYMENT_TYPES.PAY_KLARNA;
        const styles = {
            gridRow: '1 / span 2',
            alignSelf: 'flex-start'
        };

        const alternatePaymentMethod = isSaveState && isVenmo ? VENMO : PAYMENT_NAME[paymentName];
        const paymentEnabledAndDefault = sectionProps.paymentCheckoutEnabled && paymentIsDefault;
        const currentPaymentName = alternatePaymentMethod ?? this.props.locales[paymentName];
        const showPayInFour = isAfterpay || isKlarna;

        return (
            <>
                <Grid
                    columns='auto 1fr'
                    gap={'0 12px'}
                    alignItems='center'
                    lineHeight='tight'
                    rows='auto minmax(auto, 1fr)'
                    data-at={Sephora.debug.dataAt(`${sectionProps.paymentService}_section`)}
                >
                    <PaymentLogo
                        style={styles}
                        {...PAYMENT_LOGO_SIZE}
                        paymentGroupType={sectionProps.paymentGroupType}
                    />{' '}
                    {/* Span all 2 rows */}
                    <div
                        id='backgroundPaymentWidget'
                        style={{ display: 'none' }}
                    />
                    <Box
                        data-at={Sephora.debug.dataAt(`${sectionProps.paymentService}_info`)}
                        css={{ gridRow: '1 / span 2' }}
                        color={disabled ? colors.gray : ''}
                    >
                        <Text
                            is='p'
                            {...(!isSaveState && { fontWeight: 'bold' })}
                            {...(!disabled && { marginBottom: '-2px' })}
                        >
                            {currentPaymentName}
                            {paymentEnabledAndDefault && (
                                <Text
                                    is='span'
                                    fontWeight='normal'
                                >
                                    {' '}
                                    {this.props.locales.defaultPayment}
                                </Text>
                            )}
                        </Text>
                        {((alternatePaymentMethod && showPayInFour && !isSaveState && !disabled && !username && !isVenmo) ||
                            (isPaze && !isSaveState && !disabled)) && (
                            <Text
                                is='span'
                                {...(!isSaveState && { color: colors.gray })}
                                fontSize={'base'}
                                children={
                                    isPaze
                                        ? this.props.locales.payzeAvailabilty
                                        : StringUtils.format(this.props.locales[paymentName], installmentValue)
                                }
                            />
                        )}
                        {(username || showPayInFour) && !disabled && alternatePaymentMethod && isSaveState && (
                            <Text
                                is='span'
                                fontSize={'sm'}
                                children={username || (isVenmo ? '' : StringUtils.format(this.props.locales[paymentName], installmentValue))}
                            />
                        )}
                        {sectionProps.paymentCheckoutEnabled || (!disabled && <br />)}
                        {sectionProps.paymentCheckoutEnabled || this.getDisabledMessage({ sectionProps })}
                    </Box>
                </Grid>
            </>
        );
    };

    render() {
        const {
            creditCard,
            storeCredits = [],
            giftCards = [],
            showDefault,
            isApplePay,
            isPayPal,
            paymentName,
            checkoutEnabled,
            paypalEmail,
            hasSavedPaypal,
            isSummary,
            isPayPalPayLaterEligible,
            locales,
            disabled
        } = this.props;

        const {
            defaultCard, expires, payPalAccount, payWithPayPal, payNow, or, payLaterWithPayPal, endingIn, payPalDisabled, payPalUnavailable
        } =
            locales;

        const displayPayment = creditCard || isApplePay || isPayPal || paymentName || storeCredits.length > 0 || giftCards.length > 0;
        const showSavePaypalCheckbox = Sephora.configurationSettings.payPalConfigurations?.retrievePaypalFromProfileEnabled && hasSavedPaypal;

        const sectionProps = getPaymentSectionProps(paymentName, checkoutEnabled);
        const payPalText = paypalEmail ? (
            <Text
                is='p'
                fontWeight='bold'
            >
                {payPalAccount}
            </Text>
        ) : isPayPalPayLaterEligible ? (
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

        if (displayPayment) {
            return (
                <div>
                    {creditCard && (
                        <Grid
                            columns='auto 1fr'
                            gap={4}
                            alignItems='center'
                            lineHeight='tight'
                            data-at={Sephora.debug.dataAt('saved_credit_card')}
                        >
                            <PaymentLogo
                                {...PAYMENT_LOGO_SIZE}
                                cardType={OrderUtils.getThirdPartyCreditCard(creditCard)}
                                paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                            />
                            <div>
                                <Box
                                    marginBottom={isSummary || 1}
                                    fontWeight={isSummary || 'bold'}
                                    color={creditCardUtils.tokenMigrationFailed(creditCard) && 'gray'}
                                >
                                    {creditCardUtils.getCardName(creditCard.cardType)} {endingIn}{' '}
                                    {creditCardUtils.shortenCardNumber(creditCard.cardNumber)}
                                </Box>
                                {showDefault && defaultCard}
                                <span>
                                    {showDefault && (
                                        <Text
                                            marginX='.5em'
                                            children='|'
                                        />
                                    )}
                                    <Text data-at={Sephora.debug.dataAt('expires_label')}>
                                        {expires}: {creditCard.expirationMonth}/{creditCard.expirationYear}
                                    </Text>
                                </span>
                            </div>
                        </Grid>
                    )}

                    {isPayPal && (
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
                            <Box color={disabled ? colors.gray : ''}>
                                <Box {...(!disabled && { marginBottom: '-2px' })}>{payPalText}</Box>
                                {paypalEmail && (
                                    <>
                                        <Text
                                            is='span'
                                            fontSize='sm'
                                            color='#666666'
                                            data-at={Sephora.debug.dataAt('paypal_email')}
                                        >
                                            {paypalEmail}
                                        </Text>
                                        {showSavePaypalCheckbox && <SaveToAccountCheckbox />}
                                    </>
                                )}
                                {checkoutEnabled || (
                                    <Text
                                        is='p'
                                        children={payPalDisabled}
                                    />
                                )}
                                {disabled && (
                                    <Text
                                        is='p'
                                        children={payPalUnavailable}
                                    />
                                )}
                            </Box>
                        </Grid>
                    )}

                    {paymentName && this.renderPaymentService({ sectionProps })}
                </div>
            );
        } else {
            return null;
        }
    }
}

export default wrapComponent(PaymentDisplay, 'PaymentDisplay');
