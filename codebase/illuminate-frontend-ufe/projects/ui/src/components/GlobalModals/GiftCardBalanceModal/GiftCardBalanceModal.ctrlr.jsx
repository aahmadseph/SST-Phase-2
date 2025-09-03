import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Modal from 'components/Modal/Modal';
import {
    Box, Text, Image, Button
} from 'components/ui';
import {
    space, fontSizes, fontWeights, colors
} from 'style/config';
import formatGiftCardNumber from 'utils/formatGiftCardNumber';
import mediaUtils from 'utils/Media';
import { isUfeEnvProduction } from 'utils/Env';
import { WALLET_TYPE } from './constants';
import GiftCardsBindings from 'analytics/bindingMethods/components/giftCards/giftCardsBindings';
import anaConsts from 'analytics/constants';
const { GIFT_CARD } = anaConsts.EVENT_NAMES;

const { Media } = mediaUtils;
class GiftCardBalanceModal extends BaseClass {
    getWalletType = () => {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

        if (/iPhone|iPad|iPod/i.test(ua)) {
            return WALLET_TYPE.apple;
        }

        if (/Android/i.test(ua)) {
            return WALLET_TYPE.google;
        }

        return null; // default to null for desktop/other
    };
    closeModal = () => {
        const { onClose } = this.props;
        onClose();
    };

    getBridgeCardUrl = () => {
        const { encryptedGiftCard } = this.props;
        const baseUrl = isUfeEnvProduction ? 'https://app.bridgecard.app' : 'https://app-staging.bridgecard.app';

        return `${baseUrl}/?c=${encryptedGiftCard}`;
    };

    handleWalletButtonClick = () => {
        // analytics
        GiftCardsBindings.triggerLinkAnalytics({
            actionInfo: `${GIFT_CARD.ADD_TO_WALLET}`
        });

        // Open the BridgeCard URL in a new tab
        const url = this.getBridgeCardUrl();
        window.open(url, '_blank');
    };

    render() {
        const {
            isOpen, giftCardBalance = '$0.00', encryptedGiftCard = '', cardNumberInput, pinInput, localization
        } = this.props;
        const {
            appleWallet,
            googleWallet,
            appleWalletDisclaimer,
            googleWalletDisclaimer,
            addTo,
            done,
            giftCardBalanceModalTitle,
            balance,
            cardNumber,
            pin
        } = localization;
        const walletType = this.getWalletType();
        const showWalletButtons = walletType && encryptedGiftCard;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.closeModal}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{giftCardBalanceModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body padding={space[5]}>
                    <Box>
                        <Box
                            display='flex'
                            flexDirection='row'
                            alignItems='flex-start'
                            width='100%'
                        >
                            <Image
                                src='/img/ufe/payments/giftCard.svg'
                                alt='Sephora Gift Card'
                                width={80}
                                height={50}
                                marginBottom={space[4]}
                            />
                            <Box marginLeft={space[4]}>
                                <Box>
                                    <Text
                                        is='p'
                                        fontSize={fontSizes.base}
                                        fontWeight={fontWeights.medium}
                                        color={colors.gray}
                                    >
                                        {balance}
                                    </Text>
                                    <Text
                                        is='h2'
                                        fontSize={fontSizes.lg}
                                        fontWeight={fontWeights.bold}
                                        marginBottom={space[4]}
                                    >
                                        {giftCardBalance}
                                    </Text>
                                </Box>
                                <Box
                                    display='flex'
                                    justifyContent='center'
                                    marginBottom={space[3]}
                                >
                                    <Box marginRight={space[4]}>
                                        <Text
                                            is='span'
                                            fontSize={fontSizes.base}
                                            color='gray'
                                        >
                                            {cardNumber}
                                        </Text>
                                        <Text
                                            is='p'
                                            fontSize={fontSizes.base}
                                            fontWeight={fontWeights.medium}
                                        >
                                            {formatGiftCardNumber(cardNumberInput)}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            is='span'
                                            fontSize={fontSizes.base}
                                            color='gray'
                                        >
                                            {pin}
                                        </Text>
                                        <Text
                                            is='p'
                                            fontSize={fontSizes.base}
                                            fontWeight={fontWeights.medium}
                                        >
                                            {pinInput}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {showWalletButtons && (
                            <Media lessThan='sm'>
                                <Text
                                    is='p'
                                    fontSize={fontSizes.sm}
                                    color={colors.gray}
                                    marginBottom={space[4]}
                                    textAlign='start'
                                >
                                    {walletType === WALLET_TYPE.apple ? appleWalletDisclaimer : googleWalletDisclaimer}
                                </Text>
                                {walletType === WALLET_TYPE.apple && (
                                    <Button
                                        variant='primary'
                                        block={true}
                                        marginBottom={space[4]}
                                        onClick={this.handleWalletButtonClick}
                                    >
                                        <Box
                                            display='flex'
                                            alignItems='center'
                                            justifyContent='center'
                                        >
                                            <Image
                                                src='/img/ufe/payments/appleWallet.svg'
                                                alt='Apple Wallet'
                                                width={24}
                                                height={24}
                                                marginRight={space[1]}
                                            />
                                            <Box>
                                                <Text
                                                    is='p'
                                                    fontSize={fontSizes.xs}
                                                    fontWeight={fontWeights.medium}
                                                    textAlign='start'
                                                >
                                                    {addTo}
                                                </Text>
                                                {appleWallet}
                                            </Box>
                                        </Box>
                                    </Button>
                                )}
                                {walletType === WALLET_TYPE.google && (
                                    <Button
                                        variant='primary'
                                        block={true}
                                        marginBottom={space[4]}
                                        onClick={this.handleWalletButtonClick}
                                    >
                                        <Box
                                            display='flex'
                                            alignItems='center'
                                            justifyContent='center'
                                        >
                                            <Image
                                                src='/img/ufe/payments/googleWallet.svg'
                                                alt='Google Wallet'
                                                width={24}
                                                height={24}
                                                marginRight={space[1]}
                                            />
                                            <Box>
                                                <Text
                                                    is='p'
                                                    fontSize={fontSizes.xs}
                                                    fontWeight={fontWeights.medium}
                                                    textAlign='start'
                                                >
                                                    {addTo}
                                                </Text>
                                                {googleWallet}
                                            </Box>
                                        </Box>
                                    </Button>
                                )}
                            </Media>
                        )}

                        <Button
                            variant={showWalletButtons ? 'secondary' : 'primary'}
                            block={true}
                            onClick={this.closeModal}
                        >
                            {done}
                        </Button>
                    </Box>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(GiftCardBalanceModal, 'GiftCardBalanceModal', true);
