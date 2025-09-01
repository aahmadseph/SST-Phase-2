import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import CreditCard from 'components/FrictionlessCheckout/Payment/CreditCard';
import Paypal from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Paypal';
import GiftCard from 'components/FrictionlessCheckout/Payment/GiftCard';
import GiftCardItem from 'components/FrictionlessCheckout/Payment/GiftCardItem';
import { colors, fontSizes } from 'style/config';
import { PAYMENT_LOGO_SIZE } from 'components/Checkout/constants';
import ErrorMsg from 'components/ErrorMsg';
import {
    Box, Divider, Text, Grid, Image
} from 'components/ui';
import dateUtils from 'utils/Date';
import PaymentDisplay from 'components/FrictionlessCheckout/Payment/Display';

const getExpDateView = expirationDate => {
    const expDateObj = dateUtils.getDateObjectFromString(expirationDate);

    return expDateObj ? dateUtils.getDateInMMYYYY(expDateObj) : null;
};

const PaymentsDisplay = ({
    isPaymentComplete,
    creditCardPaymentGroup,
    localization,
    isPaypalSelected,
    payPalPaymentGroup,
    venmoUsername,
    storeCredits,
    giftCardPaymentGroups,
    hasGiftCardInOrder,
    alternateMethodSelected,
    alternatePaymentName,
    checkoutEnabled,
    installmentValue,
    showError,
    isEfullfillmentOrder,
    shouldRenderGiftCardSection
}) => {
    const hasNonGiftCardNonCreditPaymentAdded =
        (creditCardPaymentGroup?.isComplete || isPaypalSelected || alternateMethodSelected) && isPaymentComplete;
    const hasNonGiftCardPaymentAdded = hasNonGiftCardNonCreditPaymentAdded || storeCredits.length > 0;

    return (
        <>
            <Box paddingX={[4, 5]}>
                {isPaymentComplete && (
                    <>
                        {showError && (
                            <ErrorMsg
                                children={localization.verifyCVV}
                                fontSize={fontSizes.base}
                            />
                        )}
                        {creditCardPaymentGroup && <CreditCard creditCard={creditCardPaymentGroup} />}
                        {isPaypalSelected && <Paypal payPalPaymentGroup={payPalPaymentGroup} />}
                        {alternateMethodSelected && (
                            <PaymentDisplay
                                defaultPayment
                                paymentName={alternatePaymentName}
                                selected
                                checkoutEnabled={checkoutEnabled}
                                installmentValue={installmentValue}
                                isSaveState
                                username={venmoUsername}
                            />
                        )}
                    </>
                )}
                {storeCredits?.map((storeCredit, index) => (
                    <>
                        {(hasNonGiftCardNonCreditPaymentAdded || index !== 0) && (
                            <Divider
                                marginTop={[3, 4]}
                                marginBottom={[3, 4]}
                                color={colors.lightGray}
                                width='100%'
                                marginX={[-4, -5]}
                            />
                        )}
                        <Grid
                            key={`storeCredits_${index.toString()}`}
                            columns='auto 1fr'
                            gap={3}
                            alignItems='center'
                            lineHeight='tight'
                            marginTop={[3, 4]}
                        >
                            <Image
                                display='block'
                                src={'/img/ufe/payments/accountCredit.svg'}
                                alt={localization.accountCredit}
                                {...PAYMENT_LOGO_SIZE}
                            />
                            <Text>
                                {`+ ${storeCredit.amount} ${localization.accountCredit}`}
                                {storeCredit.expirationDate && (
                                    <Text
                                        is='p'
                                        fontSize='sm'
                                        children={`${localization.expires} ${getExpDateView(storeCredit.expirationDate)}`}
                                    />
                                )}
                            </Text>
                        </Grid>
                    </>
                ))}
                {giftCardPaymentGroups?.map((giftCard, index) => (
                    <GiftCardItem
                        giftCard={giftCard.paymentGroup}
                        hasDivider={hasNonGiftCardPaymentAdded || index !== 0}
                    />
                ))}
            </Box>
            {((!hasGiftCardInOrder && !isEfullfillmentOrder) || shouldRenderGiftCardSection) && (
                <>
                    <Divider
                        marginTop={[3, 4]}
                        color={colors.lightGray}
                    />
                    {giftCardPaymentGroups.length < 2 ? (
                        <GiftCard />
                    ) : (
                        <Text
                            is='p'
                            children={localization.maxGiftCards}
                            color='gray'
                            fontSize='sm'
                            marginX={[4, 5]}
                            lineHeight='tight'
                            marginTop={[3, 4]}
                        />
                    )}
                </>
            )}
            {hasGiftCardInOrder && !shouldRenderGiftCardSection && (
                <>
                    <Divider
                        marginTop={[3, 4]}
                        color={colors.lightGray}
                    />
                    <Text
                        is='p'
                        children={localization.giftCardsNotCombinable}
                        color='gray'
                        fontSize='sm'
                        marginX={[4, 5]}
                        lineHeight='tight'
                        marginTop={4}
                    />
                </>
            )}
        </>
    );
};

export default wrapFunctionalComponent(PaymentsDisplay, 'PaymentsDisplay');
