/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import ResponseMapper from '#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs';
import gamificationUtils from '#server/services/apiOrchestration/content/utils/gamificationUtils.mjs';
import {
    API,
    RENDERING,
    PARAMETERS,
    DATASOURCE,
    LAYOUTS
} from '#server/services/apiOrchestration/content/constants.mjs';

const DEFAULT = 'red';

class GamificationHistoricalGamesMapper extends ResponseMapper {
    createGameItems(component, historyGames, gamificationSettings) {
        const allGamesMap = gamificationUtils.getAllGamesMap(gamificationSettings);

        const items = historyGames.map((game) => {
            const gameContent = allGamesMap[String(game.promoId)];

            return gameContent ? {
                sid: `${component.sid}-${gameContent.gameId}-${RENDERING.CARD}`,
                type: RENDERING.CARD,
                datasource: {
                    sid: `${component.sid}-${gameContent.gameId}-${DATASOURCE.CARD}`,
                    type: DATASOURCE.CARD,
                    title: gameContent.title,
                    textBelowTheTitle: `**${Number(game.pointsAwarded)} ${gamificationSettings?.pointsEarned}**`,
                    textAboveTheTitle: `${gamificationSettings?.ended} ${gamificationUtils.getDateString(game.endDate)}`,
                    action: gameContent.action,
                    image: gameContent.image
                },
                parameters: {
                    sid: `${component.sid}-${gameContent.gameId}-${PARAMETERS.CARD}`,
                    type: PARAMETERS.CARD,
                    layout: LAYOUTS.SIDE_BY_SIDE,
                    titleIsHighlighted: false,
                    marketingFlagBackgroundColor: DEFAULT
                }
            } : null;
        }).filter((g) => !!g);

        return items;
    }

    enhanceComponent(component, apiResults, sharedContext) {
        const gamificationGames = apiResults[API.GAMIFICATION_GAMES];
        const {
            data: gamificationSettings
        } = apiResults[API.GAMIFICATION_SETTINGS];
        const historyGames = gamificationGames?.history || [];

        if (sharedContext?.isAnonymous === 'true') {
            component.items = gamificationUtils.createFallbackCopyComponent('fallbackCopyGamesHistoryAnonymous', component, gamificationSettings?.fallbackCopyGamesHistoryAnonymous);

            return;
        }

        const gameItems = this.createGameItems(component, historyGames, gamificationSettings);
        const totalGameItems = gameItems.length;

        if (totalGameItems) {
            component.items = gameItems;
        } else {
            component.items = gamificationUtils.createFallbackCopyComponent('fallbackCopyGamesHistory', component, gamificationSettings?.fallbackCopyGamesHistory);
        }
    }
}

export default GamificationHistoricalGamesMapper;
