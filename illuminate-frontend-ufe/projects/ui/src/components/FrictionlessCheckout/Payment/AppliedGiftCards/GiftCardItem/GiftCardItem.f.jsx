import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import PropTypes from 'prop-types';
import {
    Text, Link, Box, Image, Divider
} from 'components/ui';
import Debounce from 'utils/Debounce';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import {
    fontSizes, fontWeights, space, colors
} from 'style/config';

const GiftCardItem = ({ giftCard, localization, showInfoModal, removeGiftCard }) => {
    const {
        giftCardLabel, applied, removeLink, removeGiftCardText, areYouSureMessage
    } = localization;

    const toggleRemoveGiftCardModal = e => {
        e.preventDefault();
        const title = removeGiftCardText;
        const message = areYouSureMessage;
        const confirmButtonText = removeLink;
        const callback = removeGiftCard(giftCard);
        showInfoModal(title, message, confirmButtonText, callback);
    };

    const toggleRemoveGiftCardModalDebounce = Debounce.preventDoubleClick(toggleRemoveGiftCardModal);
    const cardNumberLastDigits = giftCard.giftCardNumber.substr(giftCard.giftCardNumber.length - 4);

    return (
        <Box data-at={Sephora.debug.dataAt('applied_gift_card_item')}>
            <Box
                data-at={Sephora.debug.dataAt('gift_card_item')}
                key={giftCard.paymentGroupId || giftCard.giftCardNumber}
            >
                <Box
                    display={['block']}
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Checkbox
                        paddingBottom={3}
                        checked={true}
                        onClick={toggleRemoveGiftCardModalDebounce}
                        inputDataAt={Sephora.debug.dataAt('gift_card_checkbox')}
                        css={styles.checkbox}
                    >
                        <Box
                            display='flex'
                            alignItems='center'
                        >
                            <Image
                                disableLazyLoad={true}
                                marginRight={3}
                                height={32}
                                width={50}
                                src='/img/ufe/payments/giftCard.svg'
                                alt={giftCardLabel}
                            />
                            <Box>
                                <Text
                                    is='span'
                                    css={styles.cardNumberText}
                                >
                                    {giftCardLabel} *{cardNumberLastDigits}
                                </Text>
                                <Text css={styles.amountText}>
                                    {giftCard.amount} {applied}
                                </Text>
                            </Box>
                        </Box>
                    </Checkbox>

                    <Box
                        marginLeft={space[6]}
                        marginBottom={[3, 0]}
                    >
                        <Link
                            onClick={toggleRemoveGiftCardModalDebounce}
                            css={styles.removeLink}
                            children={removeLink}
                            data-at={Sephora.debug.dataAt('remove_gift_card_btn')}
                        />
                    </Box>
                </Box>
                <Divider my={[2, 3]} />
            </Box>
        </Box>
    );
};

const styles = {
    cardNumberText: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold,
        display: 'block',
        marginBottom: space[1]
    },
    amountText: {
        fontSize: fontSizes.sm,
        display: 'block'
    },
    removeLink: {
        color: colors.blue,
        fontSize: fontSizes.base,
        padding: space[2],
        margin: -space[2]
    },
    checkbox: {
        alignItems: 'center'
    }
};

GiftCardItem.propTypes = {
    giftCard: PropTypes.shape({
        giftCardNumber: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        paymentGroupId: PropTypes.string
    }).isRequired,
    localization: PropTypes.shape({
        giftCardLabel: PropTypes.string.isRequired,
        hasBeenApplied: PropTypes.string.isRequired,
        applied: PropTypes.string.isRequired,
        removeLink: PropTypes.string.isRequired,
        removeGiftCardText: PropTypes.string.isRequired,
        areYouSureMessage: PropTypes.string.isRequired
    }).isRequired,
    showInfoModal: PropTypes.func.isRequired,
    removeGiftCard: PropTypes.func.isRequired
};

GiftCardItem.defaultProps = {};

export default wrapFunctionalComponent(GiftCardItem, 'GiftCardItem');
