import React from 'react';

import {
    Flex, Text, Box, Link
} from 'components/ui';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';

import { wrapFunctionalComponent } from 'utils/framework';
import Location from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import creditCardUtils from 'utils/CreditCard';
import orderUtils from 'utils/Order';
import {
    isPast, isUpcoming, isCancelled, isNoShow, isLateCancellation
} from 'utils/happeningReservation';

import Empty from 'constants/empty';

const { getLocaleResourceFile } = localeUtils;

const PAYMENT_METHODS = {
    CREDIT_DEBIT: 'CreditDebit',
    VOUCHER: 'Voucher',
    CASH: 'Cash'
};

const REFUND_TYPE = {
    CARD: 'CARD',
    ONLINE_CREDIT: 'ONLINE_CREDIT'
};

function PaymentMethodsInfo({
    paymentInfo, status, subStatus, paymentCreditCardInfo, isGuest, isGuestEventServicesEnabled
}) {
    const {
        paymentDetails: { price, tip },
        serviceFees,
        refund = {}
    } = paymentInfo;
    const getText = getLocaleResourceFile('components/Content/Happening/ReservationDetails/PaymentMethodsInfo/locales', 'PaymentMethodsInfo');

    const handleViewPoliciesClick = targetUrl => () => {
        Location.navigateTo(null, targetUrl);
    };

    const renderPaymentDetails = () => {
        if (isUpcoming(status)) {
            return {
                paymentType: `${price} ${getText('estimatedCost')}`,
                paymentMethod: getText('paymentHold')
            };
        }

        if (isPast(status)) {
            return {
                paymentType: `${price} ${getText('servicePayment')}`,
                paymentMethod: getText('paymentMethodsUsed'),
                paymentTip: tip ? `${tip} ${getText('tip')}` : ''
            };
        }

        // isCancelled(status)
        let fee = '$0';

        if (isNoShow(subStatus)) {
            fee = serviceFees?.noShowFee || fee;
            const refundAmount = refund.amount;
            const refundText = REFUND_TYPE[refund.refundType];

            return {
                paymentType: refundAmount ? `${getText('refund', [refundAmount])}` : `${fee} ${getText('noShowFee')}`,
                paymentMethod: refundAmount ? getText(refundText) : getText('paymentUsed')
            };
        }

        if (isLateCancellation(subStatus)) {
            fee = serviceFees?.cancellationFee || fee;
            const refundAmount = refund.amount;
            const refundText = REFUND_TYPE[refund.refundType];

            return {
                paymentType: refundAmount ? `${getText('refund', [refundAmount])}` : `${fee} ${getText('lateCancellationFee')}`,
                paymentMethod: refundAmount ? getText(refundText) : getText('paymentUsed')
            };
        }

        return {
            paymentMethod: getText('paymentUsed')
        };
    };

    const renderPaymentMethod = ({ cardType, otherType, methodName, methodExpiry }) => {
        return (
            <Flex gap={3}>
                <PaymentLogo
                    width={50}
                    height={32}
                    cardType={cardType ? orderUtils.getThirdPartyCreditCard({ cardType }) : otherType}
                    paymentGroupType={cardType ? orderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD : otherType}
                />
                <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                >
                    <Text
                        is={'p'}
                        lineHeight={'18px'}
                        children={methodName}
                    />
                    {methodExpiry && (
                        <Text
                            is={'p'}
                            fontSize={'sm'}
                            lineHeight={'14px'}
                            children={methodExpiry}
                        />
                    )}
                </Flex>
            </Flex>
        );
    };

    const renderCreditCard = card => {
        const {
            cardType: cardTypeProp, displayName, cardNumber, expiry, expirationMonth, expirationYear
        } = card || Empty.Object;
        const cardType = displayName || cardTypeProp;
        const shortenCardNumber = creditCardUtils.shortenCardNumber(cardNumber);
        const methodName = cardType ? `${cardType} *${shortenCardNumber}` : getText('CARD');
        const cardExpiry = expiry ? expiry : expirationMonth && expirationYear ? `${expirationMonth.padStart(2, '0')}/${expirationYear}` : '';
        const methodExpiry = cardExpiry ? `Exp ${cardExpiry}` : '';

        return renderPaymentMethod({ cardType, methodName, methodExpiry });
    };

    const renderGiftCard = card => {
        const { cardTokenNumber } = card || Empty.Object;
        const cardNumber = !cardTokenNumber || cardTokenNumber === 'null/null' ? '' : `*${cardTokenNumber}`;
        const methodName = `Giftcard ${cardNumber}`;

        return renderPaymentMethod({ otherType: 'giftCard', methodName });
    };

    const renderOnlineCredit = card => {
        const { cardTokenNumber } = card || Empty.Object;
        const cardNumber = !cardTokenNumber || cardTokenNumber === 'null/null' ? getText('ONLINE_CREDIT') : `*${cardTokenNumber}`;
        const methodName = `${cardNumber}`;

        return renderPaymentMethod({ otherType: 'onlineCredit', methodName });
    };

    const renderCash = () => renderPaymentMethod({ otherType: 'cash', methodName: 'Cash' });

    const renderPastServicePaymentMethods = () => {
        const { paymentMethods = [] } = paymentInfo;

        return paymentMethods.map(card => {
            if (card.paymentType === PAYMENT_METHODS.CREDIT_DEBIT) {
                return renderCreditCard(card);
            }

            if (card.paymentType === PAYMENT_METHODS.VOUCHER) {
                return renderGiftCard(card);
            }

            if (card.paymentType === PAYMENT_METHODS.CASH) {
                return renderCash();
            }

            return null;
        });
    };

    const renderPaymentMethods = () => {
        if (isGuestEventServicesEnabled) {
            if (isGuest) {
                return null;
            }
        }

        if (isPast(status)) {
            return renderPastServicePaymentMethods();
        }

        if (isLateCancellation(subStatus) || isNoShow(subStatus)) {
            const cardType = refund.refundType;

            if (cardType === REFUND_TYPE.CARD || paymentCreditCardInfo?.cardType) {
                return renderCreditCard(paymentCreditCardInfo);
            }

            return renderOnlineCredit({});
        }

        // When it's upcoming or cancelled
        if (paymentCreditCardInfo) {
            return renderCreditCard(paymentCreditCardInfo);
        }

        return null;
    };

    const paymentDetails = renderPaymentDetails();

    return (
        <Flex
            gap={4}
            marginBottom={3}
        >
            <Box width={105}>
                <Text
                    is={'p'}
                    fontWeight={'bold'}
                    children={getText('payment')}
                />
            </Box>
            <Box width={[215, null, null]}>
                {paymentDetails.paymentType && (
                    <>
                        <Text
                            is={'p'}
                            lineHeight={'18px'}
                            children={paymentDetails.paymentType}
                        />
                        {paymentDetails.paymentTip && (
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                marginTop={1}
                                children={paymentDetails.paymentTip}
                            />
                        )}
                    </>
                )}
                {isCancelled(status) ? (
                    refund.amount ? (
                        <Text
                            is={'p'}
                            fontSize={'sm'}
                            lineHeight={'14px'}
                            marginTop={1}
                            children={getText('taxesHit')}
                        />
                    ) : (
                        <Link
                            color='blue'
                            onClick={handleViewPoliciesClick('/beauty/beauty-services-faq')}
                        >
                            <Text
                                display='block'
                                marginTop={1}
                                children={getText('viewPolicies')}
                            />
                        </Link>
                    )
                ) : (
                    <Text
                        is={'p'}
                        fontSize={'sm'}
                        lineHeight={'14px'}
                        marginTop={1}
                        children={getText('taxesHit')}
                    />
                )}
                {!isGuest && (
                    <Text
                        is={'p'}
                        fontSize={'sm'}
                        lineHeight={'14px'}
                        color={'#666666'}
                        marginTop={3}
                        marginBottom={2}
                        children={paymentDetails.paymentMethod}
                    />
                )}
                <Flex
                    flexDirection={'column'}
                    gap={2}
                >
                    {renderPaymentMethods()}
                </Flex>
            </Box>
        </Flex>
    );
}

PaymentMethodsInfo.defaultProps = {
    paymentInfo: {
        paymentDetails: {},
        paymentMethods: [],
        serviceFees: {},
        paymentCreditCardInfo: {}
    }
};

export default wrapFunctionalComponent(PaymentMethodsInfo, 'CreditCardInfo');
