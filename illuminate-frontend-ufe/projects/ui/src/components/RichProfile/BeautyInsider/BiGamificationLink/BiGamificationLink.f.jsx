import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image, Flex, Box } from 'components/ui';
import Badge from 'components/Badge';
import Chevron from 'components/Chevron';
import { colors } from 'style/config';
import SummaryLayoutWrapper from 'components/Content/BeautyInsider/BeautyInsiderSummary/SummaryLayoutWrapper';

const BiGamificationLink = ({ localization, trackAnalytics, variant }) => {
    const isCard = variant === 'Card';

    return (
        <SummaryLayoutWrapper
            variant={variant}
            href='/beauty/challenges'
            onClick={trackAnalytics}
        >
            <Image
                src='/img/ufe/bi-gamification-icon.svg'
                width={isCard ? [24, null, 32] : '24'}
                height={isCard ? [24, null, 32] : '24'}
                marginBottom={isCard ? [0, null, 3] : 0}
                marginRight={isCard ? [2, null, 0] : 4}
                css={{ flexShrink: 0 }}
            />
            <Flex
                justifyContent='space-between'
                alignItems='center'
            >
                <p>
                    {localization.beautyChallenges}
                    <Box
                        display='inline'
                        marginLeft={2}
                        {...(isCard
                            ? {
                                position: ['relative', null, 'absolute'],
                                top: [null, null, 4],
                                right: [null, null, 4]
                            }
                            : null)}
                        is='span'
                    >
                        <Badge
                            badge={localization.new}
                            color={colors.black}
                        />
                    </Box>
                </p>
                {isCard ? null : (
                    <Chevron
                        direction='right'
                        size='.5em'
                        marginX={2}
                        css={{ flexShrink: 0 }}
                    />
                )}
            </Flex>
        </SummaryLayoutWrapper>
    );
};

BiGamificationLink.propTypes = {
    localization: PropTypes.object.isRequired,
    trackAnalytics: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(BiGamificationLink, 'BiGamificationLink');
