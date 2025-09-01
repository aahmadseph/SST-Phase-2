import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Flex, Box } from 'components/ui';
import { colors, fontSizes } from 'style/config';
import Details from 'components/Content/GameDetails/Details';
import Tasks from 'components/Content/GameDetails/Tasks';
import JoinTheChallenge from 'components/Content/GameDetails/JoinTheChallenge';
import RichText from 'components/Content/RichText';
import Media from 'components/Content/Media';
import Debounce from 'utils/Debounce';

class GameDetails extends BaseClass {
    state = {
        joinTheChallengeCtaEnabled: true
    };

    componentDidMount() {
        const { datasource, parameters, showGameCompletedModal } = this.props;

        if (parameters?.showGameCompletedModal) {
            showGameCompletedModal({
                gameId: datasource.gameId,
                gameCompletedModalImage: datasource.gameCompletedModalImage,
                gameCompletedModalTitle: datasource.gameCompletedModalTitle,
                gameCompletedModalDescription: datasource.gameCompletedModalDescription,
                gotItLabel: datasource.gotItLabel,
                promoId: datasource.promoId
            });
        }
    }

    render() {
        const {
            datasource,
            parameters,
            onJoinTheChallenge,
            fireTaskDetailAnalytics,
            setTaskDetailCTAAnalytics,
            fireJoinChallengeCTAAnalytics,
            fireRedeemPointsCTAAnalytics,
            hideJoinCTACopy,
            localization
        } = this.props;

        if (!datasource && !parameters) {
            return null;
        }

        const { joinTheChallengeCtaEnabled } = this.state;
        const {
            image,
            description,
            title,
            marketingFlagText,
            statusText,
            additionalEarningsImage,
            additionalEarningsTitle,
            additionalEarningsDescription,
            joinTheChallengeCtaLabel,
            joinCtaCopy,
            additionalEarningsImageCheckmark,
            gameDetailsCopy,
            tasks,
            pendingInfoTitle,
            pendingInfoDescription,
            gameId,
            gameJoinedModalImage,
            gameJoinedModalTitle,
            gameJoinedModalDescription,
            gotItLabel,
            promoId,
            redeemPointsCtaLabel,
            redeemPointsCtaAction,
            gameEnded
        } = datasource || {};
        const { backgroundColor, marketingFlagBackgroundColor, showJoinCta, showRedeemPointsCta } = parameters || {};
        const borderRadius = [0, 0, 2];

        const joinTheChallenge = Debounce.preventDoubleClick(({ taskId, taskPromoId }) => {
            this.setState({
                joinTheChallengeCtaEnabled: false
            });

            fireJoinChallengeCTAAnalytics(gameId);
            onJoinTheChallenge(
                {
                    gameId,
                    gameJoinedModalImage,
                    gameJoinedModalTitle,
                    gameJoinedModalDescription,
                    gotItLabel,
                    promoId,
                    gameEnded,
                    taskId,
                    taskPromoId
                },
                () =>
                    this.setState({
                        joinTheChallengeCtaEnabled: true
                    })
            );
        });

        const redeemPoints = Debounce.preventDoubleClick(() => {
            fireRedeemPointsCTAAnalytics(gameId);
        });

        return (
            <div>
                <Flex
                    flexDirection={['column', 'column', 'row']}
                    marginTop={[0, 0, 2]}
                    borderRadius={borderRadius}
                    border={[null, null, `1px solid ${colors.lightGray}`]}
                    backgroundColor={backgroundColor}
                    marginX={['-container', '-container', 0]}
                >
                    {image && (
                        <Box width={['100%', '100%', '50%']}>
                            <Media
                                {...image}
                                size={['100%', '100%']}
                                imageProps={{ borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius }}
                            />
                        </Box>
                    )}
                    <Box width={['100%', '100%', '50%']}>
                        <Details
                            description={description}
                            title={title}
                            marketingFlagText={marketingFlagText}
                            statusText={statusText}
                            additionalEarningsImage={additionalEarningsImage}
                            additionalEarningsTitle={additionalEarningsTitle}
                            additionalEarningsDescription={additionalEarningsDescription}
                            joinTheChallengeCtaLabel={joinTheChallengeCtaLabel}
                            joinTheChallengeCtaEnabled={joinTheChallengeCtaEnabled}
                            joinCtaCopy={joinCtaCopy}
                            additionalEarningsImageCheckmark={additionalEarningsImageCheckmark}
                            backgroundColor={backgroundColor}
                            marketingFlagBackgroundColor={marketingFlagBackgroundColor}
                            showJoinCta={showJoinCta}
                            gameDetailsCopy={gameDetailsCopy}
                            onJoinButtonClick={joinTheChallenge}
                            hideJoinCTACopy={hideJoinCTACopy}
                            redeemPointsCtaLabel={redeemPointsCtaLabel}
                            redeemPointsCtaAction={redeemPointsCtaAction}
                            onRedeemPointsButtonClick={redeemPoints}
                            showRedeemPointsCta={showRedeemPointsCta}
                        />
                    </Box>
                </Flex>
                {tasks && tasks.length >= 1 && (
                    <Tasks
                        tasks={tasks}
                        pendingInfoTitle={pendingInfoTitle}
                        pendingInfoDescription={pendingInfoDescription}
                        fireTaskDetailAnalytics={fireTaskDetailAnalytics}
                        setTaskDetailCTAAnalytics={setTaskDetailCTAAnalytics}
                        joinTheChallengeCtaLabel={joinTheChallengeCtaLabel}
                        joinTheChallengeCtaEnabled={joinTheChallengeCtaEnabled}
                        onJoinButtonClick={joinTheChallenge}
                        showJoinCta={showJoinCta}
                        gameEnded={gameEnded}
                        localization={localization}
                    />
                )}
                {(showJoinCta || joinCtaCopy || gameDetailsCopy) && (
                    <Flex
                        flexDirection='column'
                        display={['flex', 'flex', 'none']}
                        paddingX={4}
                        paddingTop={4}
                        paddingBottom={5}
                        marginX='-container'
                    >
                        {showJoinCta && (
                            <JoinTheChallenge
                                buttonText={joinTheChallengeCtaLabel}
                                onButtonClick={joinTheChallenge}
                                disabled={!joinTheChallengeCtaEnabled}
                            />
                        )}
                        {joinCtaCopy && (
                            <Box paddingTop={5}>
                                <RichText
                                    content={joinCtaCopy}
                                    linkColor={colors.blue}
                                    style={{ fontSize: fontSizes.base }}
                                />
                            </Box>
                        )}
                        {gameDetailsCopy && (
                            <Box paddingTop={5}>
                                <RichText
                                    content={gameDetailsCopy}
                                    linkColor={colors.blue}
                                    style={{ fontSize: fontSizes.sm }}
                                />
                            </Box>
                        )}
                    </Flex>
                )}
            </div>
        );
    }
}

GameDetails.propTypes = {
    datasource: PropTypes.shape({
        image: PropTypes.shape({
            src: PropTypes.string
        }),
        tasks: PropTypes.array,
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
        gameDetailsCopy: PropTypes.object,
        gameId: PropTypes.string,
        gameJoinedModalImage: PropTypes.object,
        gameJoinedModalTitle: PropTypes.string,
        gameJoinedModalDescription: PropTypes.string,
        gameCompletedModalImage: PropTypes.object,
        gameCompletedModalTitle: PropTypes.string,
        gameCompletedModalDescription: PropTypes.string,
        gotItLabel: PropTypes.string
    }),
    parameters: PropTypes.shape({
        backgroundColor: PropTypes.string,
        marketingFlagBackgroundColor: PropTypes.string,
        showJoinCta: PropTypes.bool
    }),
    onJoinTheChallenge: PropTypes.func,
    showGameCompletedModal: PropTypes.func
};

export default wrapComponent(GameDetails, 'GameDetails', true);
