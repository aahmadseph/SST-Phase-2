/* eslint-disable class-methods-use-this */
import {
    API
} from '#server/services/apiOrchestration/content/constants.mjs';
import gamificationUtils from '#server/services/apiOrchestration/content/utils/gamificationUtils.mjs';
import ResponseMapper from '#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs';

class GamificationActiveGamesMapper extends ResponseMapper {
    enhanceComponent(component, apiResults, sharedContext) {
        const gamificationGames = apiResults[API.GAMIFICATION_GAMES];
        const {
            data: gamificationSettings
        } = apiResults[API.GAMIFICATION_SETTINGS];
        const activeGames = gamificationGames?.active || [];
        const gameItems = gamificationUtils.createGameItems(component, activeGames, gamificationSettings, sharedContext);
        const totalGameItems = gameItems.length;

        if (totalGameItems) {
            if (component?.datasource?.title) {
                component.datasource.title = `${component.datasource.title} (${totalGameItems})`;
            }

            component.items = gameItems;
        } else {
            component.items = gamificationUtils.createFallbackCopyComponent('fallbackCopyActiveGames', component, gamificationSettings.fallbackCopyActiveGames);
        }
    }
}

export default GamificationActiveGamesMapper;
