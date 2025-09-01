/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Flex, Image, Text, Link, Box
} from 'components/ui';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import Debounce from 'utils/Debounce';

class GiftCardItem extends BaseClass {
    toggleRemoveGiftCardModal = e => {
        e.preventDefault();
        const { showInfoModal, localization, removeGiftCard } = this.props;
        const { removeGiftCardText, areYouSureMessage, removeLink } = localization;
        const title = removeGiftCardText;
        const message = areYouSureMessage;
        const confirmButtonText = removeLink;
        const callback = removeGiftCard(this.props.giftCard);
        showInfoModal(title, message, confirmButtonText, callback);
    };

    toggleRemoveGiftCardModalDebounce = Debounce.preventDoubleClick(this.toggleRemoveGiftCardModal);

    render() {
        const { giftCard, isDisplay, localization } = this.props;
        const { giftCardEndingIn, hasBeenApplied, removeLink } = localization;
        const cardNumberLastDigits = giftCard.giftCardNumber.substr(giftCard.giftCardNumber.length - 4);

        return (
            <Flex
                marginTop={isDisplay ? 5 : [4, 5]}
                lineHeight='tight'
                alignItems='center'
                data-at={Sephora.debug.dataAt('applied_gift_card_item')}
            >
                {isDisplay || <IconCheckmark marginRight={4} />}
                <Image
                    disableLazyLoad={true}
                    marginRight={4}
                    height={32}
                    width={50}
                    src='/img/ufe/payments/giftCard.svg'
                />
                <div>
                    <Text
                        is='b'
                        data-at={Sephora.debug.dataAt('applied_gift_card')}
                    >
                        {giftCardEndingIn} {cardNumberLastDigits}&nbsp;
                    </Text>
                    <Box display={['block', 'none']}>
                        <br />
                    </Box>
                    {hasBeenApplied}
                    <Link
                        onClick={this.toggleRemoveGiftCardModalDebounce}
                        color='blue'
                        padding={2}
                        marginY={-2}
                        children={removeLink}
                    />
                </div>
            </Flex>
        );
    }
}

export default wrapComponent(GiftCardItem, 'GiftCardItem');
