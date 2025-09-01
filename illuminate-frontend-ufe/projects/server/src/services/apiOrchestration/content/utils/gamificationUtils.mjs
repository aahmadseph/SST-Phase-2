import {
    RENDERING,
    PARAMETERS,
    DATASOURCE,
    LAYOUTS,
    CHALLENGE_STATUS
} from '#server/services/apiOrchestration/content/constants.mjs';

function hasGameEnded(game) {
    const endDateTime = game.endDateTime && new Date(game.endDateTime);

    return endDateTime && endDateTime !== 'Invalid Date' && new Date() >= endDateTime;
}

function calculateMarketingFlagColor(game) {
    if (!game) {
        return '';
    } else if (hasGameEnded(game)) {
        return 'gray';
    } else {
        if (game.daysLeft === undefined || game.daysLeft === null) {
            return '';
        } else if (game.daysLeft <= 14) {
            return 'red';
        } else if (game.daysLeft > 14 && game.daysLeft <= 30) {
            return 'black';
        } else {
            return '';
        }
    }
}

function calculateMarketingFlagText(game, gamificationSettings) {
    if (!game) {
        return '';
    } else if (hasGameEnded(game)) {
        return gamificationSettings.challengeEnded.toUpperCase();
    } else {
        if (game.daysLeft === undefined || game.daysLeft === null) {
            return '';
        } else if (game.daysLeft === 0) {
            return gamificationSettings.lastDay;
        } else if (game.daysLeft === 1) {
            return `${game.daysLeft} ${gamificationSettings.dayLeft}`;
        } else if (game.daysLeft <= 30) {
            return `${game.daysLeft} ${gamificationSettings.daysLeft}`;
        } else {
            return '';
        }
    }
}

function calculateActionLabelText(game, gamificationSettings, sharedContext) {
    if (!game) {
        return '';
    } else if (!sharedContext?.userId) {
        return gamificationSettings?.challengeCtaLabel;
    } else {
        if (game.gameStatus === CHALLENGE_STATUS.NOT_JOINED) {
            return gamificationSettings.challengeCtaLabelNj;
        } else if (game.gameStatus === CHALLENGE_STATUS.OPTED_IN) {
            return gamificationSettings.challengeCtaLabelJ;
        } else if (game.gameStatus === CHALLENGE_STATUS.COMPLETED) {
            return gamificationSettings.challengeCtaLabelC;
        } else {
            return gamificationSettings?.challengeCtaLabel;
        }
    }
}

function buildStatusText(gameDetails, gamificationSettings, sharedContext) {
    if (!gameDetails || !sharedContext?.userId) {
        return '';
    } else if (hasGameEnded(gameDetails)) {
        if (gameDetails.gameStatus === CHALLENGE_STATUS.OPTED_IN && (!gameDetails.pointsEarned || gameDetails.pointsEarned === 0)) {
            return gamificationSettings.gameStatusEndedJ;
        } else if (gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED && gameDetails.pointsEarned > 0) {
            return gamificationSettings.gameStatusCompleted?.replace('{0}', gameDetails.pointsEarned);
        } else if (gameDetails.gameStatus !== CHALLENGE_STATUS.NOT_JOINED && gameDetails.pointsEarned > 0) {
            return gamificationSettings.gameStatusEndedE?.replace('{0}', gameDetails.pointsEarned);
        } else {
            return '';
        }
    } else {
        return gameDetails.gameStatus === CHALLENGE_STATUS.NOT_JOINED ? gamificationSettings.gameStatusNotJoined :
            gameDetails.gameStatus === CHALLENGE_STATUS.OPTED_IN && !gameDetails.pointsEarned ? gamificationSettings.gameStatusJoined :
                gameDetails.gameStatus === CHALLENGE_STATUS.OPTED_IN && gameDetails.pointsEarned === 0 ? gamificationSettings.gameStatusPending :
                    gameDetails.gameStatus === CHALLENGE_STATUS.OPTED_IN && gameDetails.pointsEarned > 0 ? gamificationSettings.gameStatusEarned?.replace('{0}', gameDetails.pointsEarned) :
                        gameDetails.gameStatus === CHALLENGE_STATUS.COMPLETED || gameDetails.gameStatus === '' ? gamificationSettings.gameStatusCompleted?.replace('{0}', gameDetails.pointsEarned) :
                            '';
    }
}

function getAllGamesMap(gamificationSettings) {
    if (gamificationSettings && !gamificationSettings.allGamesMap) {
        gamificationSettings.allGamesMap = (gamificationSettings.allGames || []).reduce((acc, x) => {
            acc[String(x.promoId)] = x;

            return acc;
        }, {});
    }

    return gamificationSettings?.allGamesMap || {};
}

function createGameItems(component, games, gamificationSettings, sharedContext) {
    const allGamesMap = getAllGamesMap(gamificationSettings);
    let items = [];

    if (games?.length && Object.keys(allGamesMap).length) {
        items = games
            .map((game) => {
                const gameContent = allGamesMap[String(game.promoId)];
                const marketingFlagText = calculateMarketingFlagText(game, gamificationSettings);
                const marketingFlagBackgroundColor = calculateMarketingFlagColor(game);
                const actionLabel = calculateActionLabelText(game, gamificationSettings, sharedContext);

                let textBelowTheTitle;
                let imageBelowTheTitle;

                const challengeStatusText = !hasGameEnded(game) ? buildStatusText(game, gamificationSettings, sharedContext) : '';

                if (challengeStatusText) {
                    textBelowTheTitle = `**{color:green}${challengeStatusText}{color}**`;
                    imageBelowTheTitle = gamificationSettings.gameStatusImg;
                }

                return gameContent ? {
                    sid: `${component.sid}-${gameContent.gameId}-${RENDERING.CARD}`,
                    type: RENDERING.CARD,
                    datasource: {
                        sid: `${component.sid}-${gameContent.gameId}-${DATASOURCE.CARD}`,
                        type: DATASOURCE.CARD,
                        title: gameContent.title,
                        textBelowTheTitle: textBelowTheTitle,
                        description: gameContent.description,
                        action: gameContent.action,
                        image: gameContent.image,
                        imageBelowTheTitle: imageBelowTheTitle,
                        marketingFlagText: marketingFlagText,
                        actionLabel: actionLabel
                    },
                    parameters: {
                        sid: `${component.sid}-${gameContent.gameId}-${PARAMETERS.CARD}`,
                        type: PARAMETERS.CARD,
                        layout: LAYOUTS.VERTICAL,
                        titleIsHighlighted: true,
                        marketingFlagBackgroundColor: marketingFlagBackgroundColor,
                        withBorder: true
                    }
                } : null;
            })
            .filter((g) => !!g);
    }

    return items;
}

function createFallbackCopyComponent(key, component, content) {
    return (key && component && content) ? [{
        sid: `${component.sid}-${key}`,
        type: 'Copy',
        content: content,
        style: {
            marginTop: '0',
            marginBottom: '0'
        }
    }] : [];
}

function getDateString(dateString) {
    const dateArray = new Date(dateString).toDateString().split(' ');

    return `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;
}

function parseStatusForAnalytics(status) {
    switch (status) {
        case CHALLENGE_STATUS.NOT_JOINED:
            return 'not joined';
        case CHALLENGE_STATUS.OPTED_IN:
            return 'joined';
        case CHALLENGE_STATUS.COMPLETED:
            return 'completed';
        default:
            return '';
    }
}

export default {
    hasGameEnded,
    calculateMarketingFlagColor,
    calculateMarketingFlagText,
    calculateActionLabelText,
    buildStatusText,
    createGameItems,
    createFallbackCopyComponent,
    getAllGamesMap,
    getDateString,
    parseStatusForAnalytics
};
