import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Text, Flex, Image, Link
} from 'components/ui';
import GiftCardBalanceCheckForm from 'components/Content/GiftCards/GiftCardBalanceCheckForm';
import mediaUtils from 'utils/Media';

const { isMobileView } = mediaUtils;

const GiftCardBalanceCheck = ({
    isGiftcardAddToWalletEnabled,
    localization: {
        checkYourBalance, and, addToWallet, enterGiftCardNumber, reCaptcha, privacyPolicy, terms, balanceCall
    }
}) => {
    return (
        <Box
            maxWidth={612}
            backgroundColor='nearWhite'
        >
            <Flex
                flexDirection='row'
                justifyContent='space-between'
                padding={[4, 5]}
                gap={4}
            >
                <div>
                    <Text
                        is='h2'
                        fontSize='base'
                        fontWeight='bold'
                        children={isMobileView && isGiftcardAddToWalletEnabled ? `${checkYourBalance} ${and} ${addToWallet}` : `${checkYourBalance}`}
                        lineHeight='tight'
                    />
                    <Text
                        is='p'
                        fontSize='sm'
                        fontWeight='normal'
                        lineHeight='tight'
                        marginTop={2}
                        children={enterGiftCardNumber}
                    />
                </div>
                <Image
                    src='/img/ufe/gift-card-with-hand.svg'
                    width={75}
                    height={44}
                    style={styles.image}
                />
            </Flex>
            <GiftCardBalanceCheckForm />
            <Text
                is='p'
                padding={[4, 5]}
                fontSize='sm'
                lineHeight='tight'
            >
                {`${reCaptcha} `}
                <Link
                    color='blue'
                    underline={true}
                    href='https://policies.google.com/privacy?hl=en'
                    target='_blank'
                    data-at={Sephora.debug.dataAt('privacy_policy_link')}
                    children={privacyPolicy}
                />
                {' & '}
                <Link
                    color='blue'
                    underline={true}
                    href='https://policies.google.com/terms?hl=en'
                    target='_blank'
                    data-at={Sephora.debug.dataAt('terms_link')}
                    children={terms}
                />
                {`. ${balanceCall} `}
                <Link
                    href='tel:18888607897'
                    children='1-888-860-7897'
                    color='blue'
                    underline={true}
                />
                {'.'}
            </Text>
        </Box>
    );
};

const styles = {
    image: {
        flexShrink: 0
    }
};

export default wrapFunctionalComponent(GiftCardBalanceCheck, 'GiftCardBalanceCheck');
