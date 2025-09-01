/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors } from 'style/config';
import {
    Box, Grid, Image, Text, Icon
} from 'components/ui';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';
import OrderUtils from 'utils/Order';
import SaveToAccountCheckbox from 'components/Checkout/Shared/PayPal/SaveToAccountCheckbox';
import UpdateError from 'components/Checkout/Shared/UpdateError';
import GiftCardItem from 'components/Checkout/Sections/Payment/GiftCardSection/GiftCardItem/GiftCardItem';
import GiftCardSection from 'components/Checkout/Sections/Payment/GiftCardSection';
import RewardList from 'components/CreditCard/Rewards/RewardList';
import RewardGroup from 'components/Reward/RewardGroup/RewardGroup';
import RrcPromo from 'components/Reward/RrcPromo';
import LoyaltyPromo from 'components/Reward/LoyaltyPromo';
import TestTarget from 'components/TestTarget/TestTarget';
import creditCardUtils from 'utils/CreditCard';
import ErrorMsg from 'components/ErrorMsg';
import CreditCardBanner from 'components/CreditCard/CreditCardBanner';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import { PAYMENT_LOGO_SIZE } from 'components/Checkout/constants';

import store from 'store/Store';

const maxAmountToCheckout = Sephora.configurationSettings.afterpayConfigurations?.maxAmountToCheckout || 2000;

const paymentServices = {
    payWithKlarna: {
        paymentService: 'Klarna',
        paymentName: 'payWithKlarna',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.KLARNA,
        limit: 1000
    },
    payWithAfterpay: {
        paymentService: localeUtils.isUS() ? 'Cash App Afterpay' : 'Afterpay',
        paymentName: 'payWithAfterpay',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY,
        limit: maxAmountToCheckout
    },
    payWithPaze: {
        paymentService: 'Paze',
        paymentName: 'payWithPaze',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.PAZE,
        limit: maxAmountToCheckout
    },
    payWithVenmo: {
        paymentService: 'Venmo',
        paymentName: 'payWithVenmo',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.VENMO,
        limit: 0
    }
};

class PaymentDisplay extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isComplete: false,
            isKlarnaCheckoutEnabled: false
        };
    }

    componentDidMount() {
        const state = {};

        if (this.props.paymentName === 'payWithKlarna') {
            store.setAndWatch('order.orderDetails.items.isKlarnaCheckoutEnabled', this, null, true);
        }

        /*jshint ignore:start*/
        if (Object.keys(state).length !== 0) {
            this.setState({ ...state });
        }
        /*jshint ignore:end*/
    }

    renderBankRewardsMessage = bankRewardsValidPaymentsMessage => {
        const message =
            bankRewardsValidPaymentsMessage && bankRewardsValidPaymentsMessage[0].messages && bankRewardsValidPaymentsMessage[0].messages[0];

        return message ? (
            <ErrorMsg
                fontSize={null}
                marginBottom={5}
                marginTop={5}
            >
                <Grid
                    is='span'
                    columns='auto 1fr'
                    gap={2}
                >
                    <Icon
                        name='alert'
                        size={18}
                    />
                    {message}
                </Grid>
            </ErrorMsg>
        ) : null;
    };

    getSectionProps = (paymentName, checkoutEnabled) => {
        const sectionProps = paymentServices[paymentName] ? { ...paymentServices[paymentName] } : {};
        sectionProps.paymentCheckoutEnabled = checkoutEnabled;
        sectionProps.limit = localeUtils.isFRCanada()
            ? `${sectionProps.limit}${localeUtils.CURRENCY_SYMBOLS.CA_FR}`
            : `${localeUtils.CURRENCY_SYMBOLS.US}${sectionProps.limit}`;

        return sectionProps;
    };

    getDisabledMessage = ({ sectionProps, getText }) => {
        if (this.props.paymentName === 'payWithPaze') {
            return getText('pazePaymentDisabled');
        } else {
            return getText('paymentDisabled', [sectionProps.paymentService, sectionProps.limit]);
        }
    };

    renderPaymentService = ({ sectionProps, getText }) => {
        const { defaultPayment, paymentName, installmentValue } = this.props;
        const paymentIsDefault = defaultPayment && paymentName?.toLowerCase().includes(defaultPayment);
        const isPaze = paymentServices.payWithPaze.paymentName === paymentName;
        const styles = {
            gridRow: '1 / span 2',
            alignSelf: 'flex-start'
        };

        return (
            <>
                <Grid
                    columns='auto 1fr'
                    gap={'0 16px'}
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
                    <div
                        data-at={Sephora.debug.dataAt(`${sectionProps.paymentService}_info`)}
                        css={!isPaze && { gridRow: '1 / span 2' }}
                    >
                        <b>{getText(paymentName, [installmentValue])}</b>
                        {isPaze && (
                            <Text
                                is='p'
                                fontSize='base'
                                style={{ gridColumn: '2 / span 1' }}
                            >
                                {/* Start from the second column so it's aligned with text above */}
                                {getText('payzeAvailabilty')}
                            </Text>
                        )}
                        {sectionProps.paymentCheckoutEnabled && paymentIsDefault && <Text is='p'>{'Default Payment'}</Text>}
                        {sectionProps.paymentCheckoutEnabled || <br />}
                        {sectionProps.paymentCheckoutEnabled || this.getDisabledMessage({ sectionProps, getText })}
                    </div>
                </Grid>
            </>
        );
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Display/locales', 'PaymentDisplay');
        const {
            creditCard,
            storeCredits = [],
            giftCards = [],
            showDefault,
            isApplePay,
            isPayPal,
            isBopis,
            isSddOrder,
            paymentName,
            selected,
            checkoutEnabled,
            paypalEmail,
            hasSavedPaypal,
            isSummary,
            isComplete,
            bankRewardsValidPaymentsMessage,
            renderccBanner,
            hasAutoReplenishItemInBasket,
            isGiftCardShow,
            isPayPalPayLaterEligible
        } = this.props;

        const displayPayment = creditCard || isApplePay || isPayPal || paymentName || storeCredits.length > 0 || giftCards.length > 0;
        const isFPGlobalEnabled = Sephora.fantasticPlasticConfigurations.isGlobalEnabled;
        const showSavePaypalCheckbox = Sephora.configurationSettings.payPalConfigurations?.retrievePaypalFromProfileEnabled && hasSavedPaypal;
        const isCashBackRewardsEnabled = Sephora.configurationSettings.isCashBackRewardsEnabled;
        const isRewardsListDisabled = isPayPal || paymentName || (creditCard && !OrderUtils.isSephoraCardType(creditCard));
        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();
        const isVenmo = paymentName === paymentServices.payWithVenmo.paymentName;

        const ccBannerProps = {
            testEnabled: true,
            ...(isMobile
                ? {
                    padding: 4
                }
                : {
                    variant: 'row',
                    paddingX: 5,
                    paddingY: 4,
                    marginBottom: 3,
                    borderRadius: 2,
                    border: `2px solid ${colors.lightGray}`
                })
        };

        const getExpDateView = expirationDate => {
            const expDateObj = dateUtils.getDateObjectFromString(expirationDate);

            return expDateObj ? dateUtils.getDateInMDYFormat(expDateObj) : null;
        };

        const sectionProps = this.getSectionProps(paymentName, checkoutEnabled);
        const payPalText = paypalEmail ? (
            <Text
                is='p'
                fontWeight='bold'
            >
                {getText('payPalAccount')}
            </Text>
        ) : isPayPalPayLaterEligible ? (
            <>
                <Text
                    is='p'
                    fontWeight='bold'
                >
                    {getText('payNow')}
                    <Text
                        is='span'
                        fontWeight='normal'
                    >
                        {' '}
                        {getText('or')}{' '}
                    </Text>
                    {getText('payLaterWithPayPal')}
                </Text>
            </>
        ) : (
            <Text
                is='p'
                fontWeight='bold'
            >
                {getText('payWithPayPal')}
            </Text>
        );

        if (isSummary && !isComplete) {
            return <UpdateError />;
        } else if (displayPayment) {
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
                                    {creditCardUtils.getCardName(creditCard.cardType)} {getText('endingIn')}{' '}
                                    {creditCardUtils.shortenCardNumber(creditCard.cardNumber)}
                                </Box>
                                {showDefault && getText('defaultCard')}
                                <span>
                                    {showDefault && (
                                        <Text
                                            marginX='.5em'
                                            children='|'
                                        />
                                    )}
                                    <Text data-at={Sephora.debug.dataAt('expires_label')}>
                                        {getText('expires')}: {creditCard.expirationMonth}/{creditCard.expirationYear}
                                    </Text>
                                </span>
                            </div>
                        </Grid>
                    )}

                    {isPayPal && (
                        <Grid
                            columns='auto 1fr'
                            gap={4}
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
                                <Box marginBottom={1}>{payPalText}</Box>
                                {paypalEmail && (
                                    <>
                                        <span data-at={Sephora.debug.dataAt('paypal_email')}>{paypalEmail}</span>
                                        {showSavePaypalCheckbox && <SaveToAccountCheckbox />}
                                    </>
                                )}
                                {checkoutEnabled || (
                                    <Text
                                        is='p'
                                        children={getText('payPalDisabled')}
                                    />
                                )}
                            </div>
                        </Grid>
                    )}

                    {isApplePay && (
                        <Grid
                            columns='auto 1fr'
                            gap={4}
                            alignItems='center'
                            lineHeight='tight'
                        >
                            <PaymentLogo
                                {...PAYMENT_LOGO_SIZE}
                                style={
                                    isMobile
                                        ? {
                                            alignSelf: 'flex-start'
                                        }
                                        : null
                                }
                                paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.APPLEPAY}
                            />
                            <b>{getText('payWithApplePay')}</b>
                        </Grid>
                    )}

                    {paymentName && this.renderPaymentService({ sectionProps, getText })}

                    {storeCredits.length > 0 &&
                        storeCredits.map((storeCredit, index) => (
                            <Grid
                                key={`storeCredits_${index.toString()}`}
                                columns='auto 1fr'
                                gap={4}
                                alignItems='center'
                                lineHeight='tight'
                                marginTop={5}
                            >
                                <Image
                                    display='block'
                                    src={'/img/ufe/payments/accountCredit.svg'}
                                    {...PAYMENT_LOGO_SIZE}
                                />
                                <div>
                                    {`${getText('storeCreditApplied')}: ${storeCredit.amount}`}
                                    {storeCredit.expirationDate && <br />}
                                    {storeCredit.expirationDate && `${getText('expires')}: ${getExpDateView(storeCredit.expirationDate)}`}
                                </div>
                            </Grid>
                        ))}

                    {isGiftCardShow &&
                        giftCards &&
                        giftCards.length > 0 &&
                        giftCards.map((giftCard, index) => (
                            <GiftCardItem
                                key={index.toString()}
                                giftCard={giftCard}
                                isDisplay={true}
                            />
                        ))}

                    {isSummary && (
                        <RrcPromo
                            isBopis={isBopis}
                            isSddOrder={isSddOrder}
                            marginTop={[4, 5]}
                        />
                    )}

                    {isFPGlobalEnabled && isSummary && this.renderBankRewardsMessage(bankRewardsValidPaymentsMessage)}

                    <RewardGroup
                        isCheckout={true}
                        isCarousel={isDesktop}
                        marginTop={isDesktop ? 5 : 4}
                    >
                        {isFPGlobalEnabled && isSummary && (
                            <RewardList
                                isBopis={isBopis}
                                isDisabled={isRewardsListDisabled}
                            />
                        )}
                        {isCashBackRewardsEnabled && isSummary && <LoyaltyPromo isBopis={isBopis} />}
                    </RewardGroup>

                    {isSummary && !paymentName && isGiftCardShow && (
                        <GiftCardSection
                            hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                            paymentDisplay={true}
                        />
                    )}

                    {!isVenmo && paymentName && selected && (
                        <Text
                            is='p'
                            fontSize='sm'
                            marginTop={3}
                            data-at={Sephora.debug.dataAt(`${sectionProps.paymentService}_not_combinable_msg`)}
                            children={getText('paymentGiftCardMessage', [sectionProps.paymentService])}
                        />
                    )}

                    {renderccBanner && isBopis && (
                        <TestTarget
                            testName='creditCardBanners'
                            source='checkout'
                            isMobile={isMobile}
                            testEnabled
                            testComponent={CreditCardBanner}
                            isBopis={isBopis}
                            {...ccBannerProps}
                            marginTop={5}
                            gap={16}
                            marginX={isMobile ? -4 : -1}
                        />
                    )}
                </div>
            );
        } else {
            return null;
        }
    }
}

export default wrapComponent(PaymentDisplay, 'PaymentDisplay');
