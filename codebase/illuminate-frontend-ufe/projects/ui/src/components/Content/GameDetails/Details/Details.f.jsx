import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Flex, Image, Text, Box, Button
} from 'components/ui';
import {
    mediaQueries, colors, space, fontSizes
} from 'style/config';
import Badge from 'components/Badge';
import Status from 'components/Content/GameDetails/Status';
import JoinTheChallenge from 'components/Content/GameDetails/JoinTheChallenge';
import OverlayImage from 'components/OverlayImage';
import RichText from 'components/Content/RichText';
import Media from 'components/Content/Media';
import Action from 'components/Content/Action';
const ActionButton = Action(Button);

const Details = ({
    description,
    title,
    marketingFlagText,
    statusText,
    additionalEarningsImage,
    additionalEarningsTitle,
    additionalEarningsDescription,
    joinTheChallengeCtaLabel,
    joinTheChallengeCtaEnabled,
    joinCtaCopy,
    additionalEarningsImageCheckmark,
    marketingFlagBackgroundColor,
    showJoinCta,
    gameDetailsCopy,
    onJoinButtonClick,
    hideJoinCTACopy,
    redeemPointsCtaLabel,
    redeemPointsCtaAction,
    onRedeemPointsButtonClick,
    showRedeemPointsCta
}) => {
    const ctaStyles = { fontSize: fontSizes.sm };

    return (
        <Flex
            flexDirection='column'
            justifyContent='space-between'
            css={styles.card}
            height='100%'
        >
            <Box margin='auto 0'>
                {marketingFlagText && (
                    <Box
                        marginTop='-4px'
                        marginBottom='2px'
                    >
                        <Badge
                            badge={marketingFlagText}
                            color={marketingFlagBackgroundColor}
                        />
                    </Box>
                )}
                {title && (
                    <Text
                        children={title}
                        is='h1'
                        fontSize={['lg', 'lg', 'xl']}
                        lineHeight='tight'
                        fontWeight='bold'
                        marginBottom={2}
                    />
                )}
                {statusText && <Status status={statusText} />}
                {description && (
                    <Text
                        children={description}
                        is='p'
                        fontSize={['base', 'base', 'md']}
                        lineHeight='tight'
                        marginBottom={4}
                    />
                )}

                <Flex flexDirection='row'>
                    {additionalEarningsImage && (
                        <OverlayImage
                            image={
                                <Media
                                    {...additionalEarningsImage}
                                    size={56}
                                />
                            }
                            overlayImage={additionalEarningsImageCheckmark ? <Image src='/img/ufe/filled-checkmark.svg' /> : null}
                        />
                    )}
                    <Flex
                        flexDirection='column'
                        marginLeft={3}
                        justifyContent='center'
                    >
                        {additionalEarningsTitle && (
                            <Text
                                children={additionalEarningsTitle}
                                is='h3'
                                fontSize='md'
                                lineHeight='tight'
                                fontWeight='bold'
                            />
                        )}
                        {additionalEarningsDescription && (
                            <Text
                                children={additionalEarningsDescription}
                                is='p'
                                fontSize='base'
                                lineHeight='tight'
                            />
                        )}
                    </Flex>
                </Flex>
                {showJoinCta && (
                    <Box
                        paddingTop={5}
                        display={['none', 'none', 'block']}
                    >
                        <JoinTheChallenge
                            buttonText={joinTheChallengeCtaLabel}
                            onButtonClick={onJoinButtonClick}
                            disabled={!joinTheChallengeCtaEnabled}
                        />
                    </Box>
                )}
                {showRedeemPointsCta && (
                    <Box paddingTop={5}>
                        <ActionButton
                            variant='primary'
                            children={redeemPointsCtaLabel}
                            width={['100%', '100%', '14.5em']}
                            action={redeemPointsCtaAction}
                            onClick={onRedeemPointsButtonClick}
                            useRedirect={true}
                        />
                    </Box>
                )}
                {hideJoinCTACopy
                    ? null
                    : joinCtaCopy && (
                        <Box
                            marginTop={2}
                            display={['none', 'none', 'block']}
                        >
                            <RichText
                                content={joinCtaCopy}
                                linkColor={colors.blue}
                            />
                        </Box>
                    )}
            </Box>
            {gameDetailsCopy && (
                <Flex
                    display={['none', 'none', 'flex']}
                    justifySelf='end'
                    marginBottom={3}
                >
                    <RichText
                        content={gameDetailsCopy}
                        linkColor={colors.blue}
                        style={ctaStyles}
                    />
                </Flex>
            )}
        </Flex>
    );
};

const styles = {
    card: {
        padding: `${space[4]}px`,
        [mediaQueries.md]: {
            padding: `0 ${space[7]}px`
        }
    }
};

Details.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string,
    marketingFlagText: PropTypes.string,
    statusText: PropTypes.string,
    additionalEarningsImage: PropTypes.shape({
        src: PropTypes.string
    }),
    additionalEarningsTitle: PropTypes.string,
    additionalEarningsDescription: PropTypes.string,
    joinTheChallengeCtaLabel: PropTypes.string,
    joinCtaCopy: PropTypes.object,
    additionalEarningsImageCheckmark: PropTypes.bool,
    marketingFlagBackgroundColor: PropTypes.string,
    showJoinCta: PropTypes.bool,
    gameDetailsCopy: PropTypes.object,
    gameId: PropTypes.string,
    onJoinButtonClick: PropTypes.func
};

Details.defaultProps = {
    backgroundColor: '#F1FDFA'
};

export default wrapFunctionalComponent(Details, 'Details');
