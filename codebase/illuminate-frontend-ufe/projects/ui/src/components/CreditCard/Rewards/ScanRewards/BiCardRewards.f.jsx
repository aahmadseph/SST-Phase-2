import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ScanRewardButton from 'components/CreditCard/Rewards/ScanRewards/ScanRewardButton';
import BiBarcode from 'components/BiBarcode/BiBarcode';
import { Box, Image, Flex } from 'components/ui';
import userUtils from 'utils/User';
import languageLocale from 'utils/LanguageLocale';
import { shadows } from 'style/config';

const BiCardRewards = props => {
    const { vibSegment, promotionPoints = 0, profileId, isActiveId } = props;

    const getText = languageLocale.getLocaleResourceFile('components/CreditCard/Rewards/ScanRewards/locales', 'BiCardRewards');

    const statusDisplay = userUtils.displayBiStatus(vibSegment);

    return (
        <Box
            borderRadius={2}
            lineHeight='tight'
            boxShadow={shadows.light}
            padding={4}
        >
            <Flex
                marginBottom={5}
                lineHeight='none'
                alignItems='baseline'
                justifyContent='space-between'
            >
                <Image
                    src={`/img/ufe/bi/logo-${statusDisplay.toLowerCase()}.svg`}
                    height={17}
                    alt={statusDisplay}
                />
                <span>
                    <b>{promotionPoints.toLocaleString()}</b> {promotionPoints !== 1 ? getText('points') : getText('point')}
                </span>
            </Flex>

            <ScanRewardButton
                id={profileId}
                text={getText('showCard')}
                {...props}
            />

            <div style={!isActiveId(profileId) ? { display: 'none' } : null}>
                <BiBarcode profileId={profileId} />
            </div>
        </Box>
    );
};

export default wrapFunctionalComponent(BiCardRewards, 'BiCardRewards');
