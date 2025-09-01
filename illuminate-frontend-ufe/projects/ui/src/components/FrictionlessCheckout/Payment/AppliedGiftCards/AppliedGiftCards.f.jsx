import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import PropTypes from 'prop-types';
import GiftCardItem from './GiftCardItem';

const AppliedGiftCards = ({ giftCardPaymentGroups, localization, removeGiftCard, showInfoModal }) => {
    if (!giftCardPaymentGroups || giftCardPaymentGroups.length === 0) {
        return null;
    }

    return (
        <Box
            marginTop={4}
            data-at={Sephora.debug.dataAt('applied_gift_cards_section')}
        >
            {giftCardPaymentGroups.map((group, index) => (
                <GiftCardItem
                    key={`gift-card-${index}`}
                    giftCard={group.paymentGroup}
                    localization={localization}
                    removeGiftCard={removeGiftCard}
                    showInfoModal={showInfoModal}
                />
            ))}
        </Box>
    );
};

AppliedGiftCards.propTypes = {
    giftCardPaymentGroups: PropTypes.arrayOf(
        PropTypes.shape({
            paymentGroup: PropTypes.object.isRequired
        })
    ),
    localization: PropTypes.shape({
        giftCardLabel: PropTypes.string.isRequired,
        hasBeenApplied: PropTypes.string.isRequired,
        applied: PropTypes.string.isRequired,
        removeLink: PropTypes.string.isRequired,
        removeGiftCardText: PropTypes.string.isRequired,
        areYouSureMessage: PropTypes.string.isRequired
    }).isRequired,
    removeGiftCard: PropTypes.func.isRequired,
    showInfoModal: PropTypes.func.isRequired
};

AppliedGiftCards.defaultProps = {
    giftCardPaymentGroups: []
};

export default wrapFunctionalComponent(AppliedGiftCards, 'AppliedGiftCards');
