import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Divider
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const MyBeautyBank = props => {
    const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/BeautyInsiderSection/MyBeautyBank/locales', 'MyBeautyBank');
    const { earnedPoints, redeemedPoints } = props;
    const isMobile = Sephora.isMobile();

    return (
        <Box
            data-at={Sephora.debug.dataAt('bi_points_activity_section')}
            lineHeight='tight'
        >
            <Text
                is='h3'
                textAlign='center'
                fontWeight='bold'
                marginBottom={4}
                data-at={Sephora.debug.dataAt('bi_points_activity_label')}
                children={getText('biSummaryText')}
            />
            {earnedPoints > 0 ? (
                <Flex
                    justifyContent='space-between'
                    marginTop={3}
                    data-at={Sephora.debug.dataAt('points_earned')}
                >
                    <span>{getText('pointsEarned')}</span>
                    <span>+{earnedPoints}</span>
                </Flex>
            ) : null}
            {redeemedPoints > 0 ? (
                <Flex
                    justifyContent='space-between'
                    marginTop={3}
                    data-at={Sephora.debug.dataAt('points_used')}
                >
                    <span>{getText('pointsUsed')}</span>
                    <span>-{redeemedPoints}</span>
                </Flex>
            ) : null}
            <Divider marginY={4} />
            <Text
                is='p'
                fontSize={isMobile ? 'sm' : 'xs'}
                color='gray'
            >
                {getText('balanceUpdateMessage')}
            </Text>
        </Box>
    );
};

export default wrapFunctionalComponent(MyBeautyBank, 'MyBeautyBank');
