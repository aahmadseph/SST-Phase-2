import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { BEAUTY_PREFERENCES },
    PAGE_NAMES: { MY_SEPHORA, BEAUTY_PREFERENCES: BEAUTY_PREFERENCES_PAGE },
    PAGE_TYPES: { SIGN_IN },
    ASYNC_PAGE_LOAD,
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class BeautyPreferencesBindings {
    static triggerSOTAnalytics = ({ eventName, ...data }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                ...data
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static triggerSOTAsyncAnalytics = ({ ...data }) => {
        const eventData = {
            data
        };

        processEvent.process(ASYNC_PAGE_LOAD, eventData);
    };

    static skipQuestion = ({ accordionName }) => {
        const { SKIP_QUESTION, ACCORDION } = BEAUTY_PREFERENCES;
        BeautyPreferencesBindings.triggerSOTAnalytics({
            actionInfo: SKIP_QUESTION,
            linkName: SKIP_QUESTION,
            pageType: MY_SEPHORA,
            pageDetail: ACCORDION,
            pageTitle: `${MY_SEPHORA}:${BEAUTY_PREFERENCES_PAGE}:n/a:*`,
            accordionName: accordionName
        });
    };

    static ingredientPreferencesFavoriteBrands = ({ isIngredientPref }) => {
        const { INGREDIENT_PREFERENCES, FAVORITE_BRANDS } = BEAUTY_PREFERENCES;
        BeautyPreferencesBindings.triggerSOTAsyncAnalytics({
            pageType: MY_SEPHORA,
            pageTypeDetail: isIngredientPref ? INGREDIENT_PREFERENCES : FAVORITE_BRANDS
        });
    };

    static saveAndContinue = ({
        completionPercentage, selectedAccordionName, beautyPreferences, selectedAccordionValue, saveOnly
    }) => {
        const { SAVE, SAVE_AND_CONTINUE } = BEAUTY_PREFERENCES;
        BeautyPreferencesBindings.triggerSOTAnalytics({
            actionInfo: saveOnly ? SAVE : SAVE_AND_CONTINUE,
            linkName: saveOnly ? SAVE : SAVE_AND_CONTINUE,
            completionPercentage,
            selectedAccordionName,
            selectedAccordionValue,
            ...beautyPreferences
        });
    };

    static signInToSave = () => {
        const { SIGN_IN: SIGN_IN_TO_SAVE } = BEAUTY_PREFERENCES;
        BeautyPreferencesBindings.triggerSOTAsyncAnalytics({
            pageType: SIGN_IN,
            pageDetail: SIGN_IN,
            previousActionType: SIGN_IN_TO_SAVE
        });
    };

    static openAccordion = ({ accordionName }) => {
        const { ACCORDION_OPEN, ACCORDION } = BEAUTY_PREFERENCES;
        BeautyPreferencesBindings.triggerSOTAsyncAnalytics({
            pageType: MY_SEPHORA,
            pageDetail: ACCORDION,
            linkName: ACCORDION_OPEN,
            actionInfo: ACCORDION_OPEN,
            accordionName
        });
    };

    static skipModalQuestion = ({ accordionName }) => {
        const { SKIP_QUESTION } = BEAUTY_PREFERENCES;
        BeautyPreferencesBindings.triggerSOTAnalytics({
            eventName: SKIP_QUESTION,
            accordionName
        });
    };

    static keepGoing = () => {
        const { KEEP_GOING } = BEAUTY_PREFERENCES;
        BeautyPreferencesBindings.triggerSOTAnalytics({
            eventName: KEEP_GOING
        });
    };
}

export default BeautyPreferencesBindings;
