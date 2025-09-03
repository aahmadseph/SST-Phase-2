import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Flex, Text } from 'components/ui';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';

import localeUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';

const { getLocaleResourceFile } = localeUtils;

function CreditCard({
    cardType, cardNumber, expirationMonth, expirationYear, isDefault, ...boxStyles
}) {
    const getText = getLocaleResourceFile('components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCard/locales', 'CreditCard');

    return (
        <Flex
            alignItems={'center'}
            gap={3}
            {...boxStyles}
        >
            <PaymentLogo
                width={50}
                height={32}
                cardType={cardType ? orderUtils.getThirdPartyCreditCard({ cardType }) : ''}
                paymentGroupType={orderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
            />
            <div>
                <Text
                    is={'p'}
                    children={`${cardType} *${cardNumber?.replace(/[x-]/g, '')} ${isDefault ? getText('default') : ''}`}
                />
                <Text
                    is={'p'}
                    fontSize={'sm'}
                    children={`${getText('exp')} ${expirationMonth}/${expirationYear}`}
                />
            </div>
        </Flex>
    );
}

export default wrapFunctionalComponent(CreditCard, 'CreditCard');
