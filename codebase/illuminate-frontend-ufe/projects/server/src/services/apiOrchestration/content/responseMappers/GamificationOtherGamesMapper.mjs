/* eslint-disable class-methods-use-this */
import {
    API
} from '#server/services/apiOrchestration/content/constants.mjs';
import gamificationUtils from '#server/services/apiOrchestration/content/utils/gamificationUtils.mjs';
import ResponseMapper from '#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs';

class GamificationOtherGamesMapper extends ResponseMapper {
    enhanceComponent(component, apiResults, sharedContext) {
        const {
            data: gamificationSettings
        } = apiResults[API.GAMIFICATION_SETTINGS];
        const gamificationGameDetails = apiResults[API.GAMIFICATION_GAME_DETAILS];
        const otherActiveGames = gamificationGameDetails?.otherActiveGames || [];
        const gameItems = gamificationUtils.createGameItems(component, otherActiveGames, gamificationSettings, sharedContext);
        const totalGameItems = gameItems.length;

        if (totalGameItems) {
            if (component?.datasource?.title) {
                component.datasource.title = `${component.datasource.title} (${totalGameItems})`;
            }

            component.items = gameItems;
        } else {
            component.items = gamificationUtils.createFallbackCopyComponent('fallbackCopyOtherGames', component, gamificationSettings?.fallbackCopyOtherGames);
        }
    }
}

export default GamificationOtherGamesMapper;
