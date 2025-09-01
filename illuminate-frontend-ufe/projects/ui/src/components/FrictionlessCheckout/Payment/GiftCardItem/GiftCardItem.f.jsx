import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import OrderUtils from 'utils/Order';
import creditCardUtils from 'utils/CreditCard';
import {
    Grid, Text, Link, Flex, Divider
} from 'components/ui';
import { colors } from 'style/config';
import PaymentLogo from 'components/FrictionlessCheckout/Payment/PaymentLogo';
import { PAYMENT_LOGO_SIZE } from 'components/RwdCheckout/constants';
import Debounce from 'utils/Debounce';

const CARD_TYPE_GC = 'giftCard';
const GiftCardItem = ({
    giftCard, hasDivider, localization, showInfoModal, removeGiftCard
}) => {
    const {
        giftCardLabel, applied, remove, removeGiftCardText, areYouSureMessage
    } = localization;

    const toggleRemoveGiftCardModal = e => {
        e.preventDefault();
        const title = removeGiftCardText;
        const message = areYouSureMessage;
        const confirmButtonText = remove;
        const callback = removeGiftCard(giftCard);
        showInfoModal(title, message, confirmButtonText, callback);
    };

    const toggleRemoveGiftCardModalDebounce = Debounce.preventDoubleClick(toggleRemoveGiftCardModal);

    return (
        <>
            {hasDivider && (
                <Divider
                    marginTop={[3, 4]}
                    marginBottom={[3, 4]}
                    color={colors.lightGray}
                    width='100%'
                    marginX={[-4, -5]}
                />
            )}
            <Flex justifyContent='space-between'>
                <Grid
                    columns='auto 1fr'
                    gap={3}
                    alignItems='center'
                    lineHeight='tight'
                >
                    <PaymentLogo
                        {...PAYMENT_LOGO_SIZE}
                        cardType={CARD_TYPE_GC}
                        paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                    />
                    <div>
                        <Text is='p'>
                            {giftCardLabel} *{creditCardUtils.shortenCardNumber(giftCard.giftCardNumber)}
                        </Text>
                        <Text
                            data-at={Sephora.debug.dataAt('expires_label')}
                            fontSize={12}
                        >
                            {`${giftCard.amount} ${applied}`}
                        </Text>
                    </div>
                </Grid>
                <Link
                    children={remove}
                    color='blue'
                    onClick={toggleRemoveGiftCardModalDebounce}
                />
            </Flex>
        </>
    );
};

export default wrapFunctionalComponent(GiftCardItem, 'GiftCardItem');
