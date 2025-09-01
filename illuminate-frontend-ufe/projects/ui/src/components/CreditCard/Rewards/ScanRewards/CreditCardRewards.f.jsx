import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ScanRewardButton from 'components/CreditCard/Rewards/ScanRewards/ScanRewardButton';
import Barcode from 'components/Barcode/Barcode';
import {
    Box, Flex, Image, Text
} from 'components/ui';
import languageLocale from 'utils/LanguageLocale';
import { shadows } from 'style/config';

const CreditCardRewards = props => {
    const getText = languageLocale.getLocaleResourceFile('components/CreditCard/Rewards/ScanRewards/locales', 'CreditCardRewards');

    const { rewardCertificates } = props;

    return (
        <React.Fragment>
            {rewardCertificates.map(({ rewardAmount, expireDate, certificateNumber }, index) => (
                <Box
                    key={index.toString()}
                    borderRadius={2}
                    lineHeight='tight'
                    boxShadow={shadows.light}
                    paddingX={4}
                    paddingTop={4}
                    paddingBottom={1}
                    marginTop={5}
                >
                    <Flex
                        marginBottom={5}
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Image
                            src='/img/ufe/credit-card/front-back.svg'
                            display='block'
                            width={42}
                            height={35}
                            disableLazyLoad
                        />
                        <Text
                            textAlign='right'
                            fontSize='md'
                        >
                            <b>{`$${rewardAmount} `}</b>
                            {getText('ccReward')}
                            <br />
                            <Text
                                color='gray'
                                fontSize='base'
                            >
                                {getText('exp')}
                                <Text marginLeft={2}>{expireDate}</Text>
                            </Text>
                        </Text>
                    </Flex>

                    <ScanRewardButton
                        id={certificateNumber}
                        {...props}
                    />

                    <div
                        style={
                            props.activeId !== certificateNumber
                                ? {
                                    display: 'none'
                                }
                                : null
                        }
                    >
                        <Barcode
                            id={certificateNumber}
                            code={'CODE39'}
                            hasBorder={true}
                        />
                    </div>

                    <Text
                        is='p'
                        marginY={2}
                        textAlign='center'
                        fontSize='sm'
                    >
                        {certificateNumber}
                    </Text>
                </Box>
            ))}
        </React.Fragment>
    );
};

export default wrapFunctionalComponent(CreditCardRewards, 'CreditCardRewards');
