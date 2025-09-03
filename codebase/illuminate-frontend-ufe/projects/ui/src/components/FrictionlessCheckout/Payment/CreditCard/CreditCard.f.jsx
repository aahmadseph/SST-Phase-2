import { wrapFunctionalComponent } from 'utils/framework';
import React from 'react';
import { Grid, Text } from 'components/ui';
import OrderUtils from 'utils/Order';
import creditCardUtils from 'utils/CreditCard';
import { PAYMENT_LOGO_SIZE } from 'components/RwdCheckout/constants';
import PaymentLogo from 'components/FrictionlessCheckout/Payment/PaymentLogo';
import { SEPHORA_CARD_TYPES, FC_CARD_LABELS, CARD_NAMES } from 'constants/CreditCard';

const getCardName = cardType => {
    const cardNames = {
        [SEPHORA_CARD_TYPES.PRIVATE_LABEL]: FC_CARD_LABELS.SEPH,
        [SEPHORA_CARD_TYPES.PRIVATE_LABEL_TEMP]: FC_CARD_LABELS.SEPH,
        [SEPHORA_CARD_TYPES.CO_BRANDED]: FC_CARD_LABELS.VISA,
        [SEPHORA_CARD_TYPES.CO_BRANDED_TEMP]: FC_CARD_LABELS.VISA,
        [CARD_NAMES.AMEX]: FC_CARD_LABELS.AMEX,
        [CARD_NAMES.MASTER]: FC_CARD_LABELS.MASTER,
        [CARD_NAMES.DISCOVER]: FC_CARD_LABELS.DISCOVER
    };

    return cardNames[cardType] || cardType;
};

function CreditCard({ creditCard, showDefault, locales, isEditView }) {
    return (
        <Grid
            columns='auto 1fr'
            gap={3}
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
                <Text
                    is='p'
                    lineHeight={1}
                    {...(isEditView && {
                        fontWeight: 'bold'
                    })}
                >
                    {getCardName(creditCard.cardType)} *{creditCardUtils.shortenCardNumber(creditCard.cardNumber)}{' '}
                    {isEditView && showDefault && locales.defaultCard}
                </Text>
                {showDefault && !isEditView && (
                    <Text
                        marginX='.5em'
                        children='|'
                    />
                )}
                <Text
                    data-at={Sephora.debug.dataAt('expires_label')}
                    fontSize={12}
                    children={`${locales.exp} ${creditCard.expirationMonth}/${creditCard.expirationYear}`}
                />
            </div>
        </Grid>
    );
}

export default wrapFunctionalComponent(CreditCard, 'CreditCard');
