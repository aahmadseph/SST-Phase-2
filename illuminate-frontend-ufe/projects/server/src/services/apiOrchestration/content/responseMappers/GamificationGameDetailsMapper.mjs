/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import {
    API,
    PARAMETERS,
    DATASOURCE,
    CHALLENGE_STATUS
} from '#server/services/apiOrchestration/content/constants.mjs';
import ResponseMapper from '#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs';
import gamificationUtils from '#server/services/apiOrchestration/content/utils/gamificationUtils.mjs';

class GamificationGameDetailsMapper extends ResponseMapper {

    mapTasks(gameTasks, gameTaskDetails, gamificationSettings, gameDetails) {
        const result = gameTasks
            .map(t => this.createTask(t, gameTaskDetails.find(td => td.promoId === t.promoId), gamificationSettings, gameDetails))
            .filter((x) => !!x);

        return result;
    }

    createTask(task, taskDetails, gamificationSettings, gameDetails) {
        if (!task || !taskDetails) {
            return null;
        }

        const hasGameEnded = gamificationUtils.hasGameEnded(gameDetails);
        const gameJoined = gameDetails.gameStatus === CHALLENGE_STATUS.OPTED_IN || gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED;
        const pointsPending = taskDetails.pointStatus === 'PENDING';
        const pointsEarned = taskDetails.pointStatus === 'RELEASED';
        const showCtaLabel = gameJoined && !pointsPending && !pointsEarned && !hasGameEnded;
        const modalCtaDisabled = !gameJoined || pointsPending || pointsEarned || hasGameEnded || false;
        const modalCtaLabel = !modalCtaDisabled ? task.modalCtaLabel :
            hasGameEnded ? gamificationSettings.challengeEnded :
                !gameJoined ? gamificationSettings.joinTheChallenge : gamificationSettings.completed;

        const pointStatusText = pointsPending ? gamificationSettings.pointsPending :
            pointsEarned ? gamificationSettings.pointsEarned :
                gamificationSettings.points;
        const checmkarkStatus = pointsPending ? 'pending' : pointsEarned ? 'completed' : '';

        const result = {
            id: task.taskId,
            promoId: taskDetails.promoId,
            image: pointsEarned ? task.imageCompleted : task.image,
            description: task.description,
            pointsText: `${taskDetails.taskTotalPoints} ${pointStatusText}`,
            showCheckmark: checmkarkStatus,
            showCtaLabel: showCtaLabel,
            ctaLabel: task.ctaLabel,
            modalImage: task.modalImage,
            modalTitle: task.modalTitle,
            modalCopy: task.modalCopy,
            modalCtaDisabled: modalCtaDisabled,
            modalCtaLabel: modalCtaLabel,
            modalCtaAction: task.modalCtaAction,
            modalStatus: task.modalStatus,
            features: task.features
        };

        return result;
    }

    buildExtraOptions(api, component) {
        return api === API.GAMIFICATION_GAME_DETAILS ?
            ({
                promoId: component.featuresData?.find(x => x.type === 'GamificationGame')?.promoId
            }) :
            ({});
    }

    shouldShowJoinChallengeCta(gameDetails) {
        return gameDetails.gameStatus === CHALLENGE_STATUS.NOT_JOINED && !gamificationUtils.hasGameEnded(gameDetails);
    }

    shouldShowRedeemPointsCta(gameDetails) {
        return gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED || gamificationUtils.hasGameEnded(gameDetails) && gameDetails.pointsEarned > 0;
    }

    enhanceComponent(component, apiResults, sharedContext) {
        const gamificationSettings = apiResults[API.GAMIFICATION_SETTINGS]?.data;

        if (!gamificationSettings) {
            throw new Error(`GamificationGameDetailsMapper hasn't found any GamificationSettings data for ${component.sid}`);
        }

        const currentGame = apiResults[API.GAMIFICATION_GAME_DETAILS]?.currentGame;

        if (currentGame.unauthorized) {
            return {
                sid: 'Gamification-Unauthorized-Copy',
                type: 'Copy',
                content: gamificationSettings.fallbackCopySoftLaunch
            };
        }

        const game = component.featuresData?.find(x => x.type === 'GamificationGame');
        const gameTasks = game?.tasks;

        if (!game || !gameTasks) {
            throw new Error(`GamificationGameDetailsMapper hasn't found any GamificationGame in featuresData for ${component.sid}, or tasks empty.`);
        }

        const gameDetails = currentGame?.gameDetails;
        const gameTaskDetails = currentGame?.tasks;

        if (!gameDetails || !gameTaskDetails) {
            throw new Error(`GamificationGameDetailsMapper hasn't found any currentGame.gameDetails and/or currentGame.tasks for ${component.sid}`);
        }

        const statusText = gamificationUtils.buildStatusText(gameDetails, gamificationSettings, sharedContext);

        const datasource = {
            sid: `${component.sid}-${DATASOURCE.GAME_DETAILS}`,
            type: DATASOURCE.GAME_DETAILS,
            gameId: typeof gameDetails.gameId === 'number' ? gameDetails.gameId.toString() : gameDetails.gameId,
            promoId: gameDetails.promoId,
            status: gameDetails.gameStatus,
            image: game.image,
            title: game.title,
            description: game.description,
            statusText: statusText,
            gameEndDateTime: gameDetails.endDateTime,
            gameEnded: gamificationUtils.hasGameEnded(gameDetails),
            statusForAnalytics: gamificationUtils.parseStatusForAnalytics(gameDetails.gameStatus),
            additionalEarningsTitle: gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED ? game.bonusEarnedTitle : game.bonusEarnTitle,
            additionalEarningsDescription: gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED ?
                game.bonusEarnedDescription : game.bonusEarnDescription,
            additionalEarningsImage: game.additionalEarningsMedia,
            additionalEarningsImageCheckmark: gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED,
            marketingFlagText: gamificationUtils.calculateMarketingFlagText(gameDetails, gamificationSettings),
            joinTheChallengeCtaLabel: gamificationSettings.joinTheChallenge,
            pendingInfoTitle: gamificationSettings.pendingInfoTitle,
            pendingInfoDescription: gamificationSettings.pendingInfoDescription,
            gotItLabel: gamificationSettings.gotIt,
            tasks: this.mapTasks(gameTasks, gameTaskDetails, gamificationSettings, gameDetails),
            gameJoinedModalImage: gamificationSettings.gameJoinedImage,
            gameJoinedModalTitle: gamificationSettings.gameJoinedTitle?.replace('{0}', game.title),
            gameJoinedModalDescription: gamificationSettings.gameJoinedDescription?.replace('{0}', gameTaskDetails[0]?.taskTotalPoints),
            gameCompletedModalImage: gamificationSettings.gameCompletedImage,
            gameCompletedModalTitle: gamificationSettings.gameCompletedTitle?.replace('{0}', game.title),
            gameCompletedModalDescription: gamificationSettings.gameCompletedDescription?.replace('{0}', game.title)?.replace('{1}', gameDetails.gameTotalPoints)
        };

        const parameters = {
            sid: `${component.sid}-${PARAMETERS.GAME_DETAILS}`,
            type: PARAMETERS.GAME_DETAILS,
            backgroundColor: game.backgroundColor,
            marketingFlagBackgroundColor: gamificationUtils.calculateMarketingFlagColor(gameDetails),
            showJoinCta: this.shouldShowJoinChallengeCta(gameDetails),
            showRedeemPointsCta: this.shouldShowRedeemPointsCta(gameDetails),
            showGameCompletedModal: gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED && !gameDetails.customerNotified
        };

        if (!sharedContext.userId) {
            datasource.joinCtaCopy = gamificationSettings.joinCtaCopy;
        }

        if (parameters.showJoinCta) {
            datasource.gameDetailsCopy = gamificationSettings.gameDetailsCopy;
        }

        if (parameters.showRedeemPointsCta) {
            datasource.redeemPointsCtaLabel = gamificationSettings.redeemPtsLabel;
            datasource.redeemPointsCtaAction = gamificationSettings.redeemPtsAction;
        }

        component.datasource = datasource;
        component.parameters = parameters;
    }

}

export default GamificationGameDetailsMapper;
