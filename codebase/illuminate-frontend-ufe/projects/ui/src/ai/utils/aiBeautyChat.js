import Categories from 'ai/constants/availabilityPlacements';
import { getGENAIAnonymousId, setGENAIAnonymousId } from 'ai/utils/sessionStorage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import UUIDv4 from 'utils/UUID';

function hasCategoryId(obj, availableCategories) {
    let current = obj;

    while (current) {
        if (availableCategories.some(category => category.id === current.categoryId)) {
            return true;
        }

        current = current.parentCategory;
    }

    return false;
}

function getAllAvailableCategories() {
    const { isGenAIFragranceChatEnabled, isGenAIBathAndBodyChatEnabled, isGenAIToolsAndBrushesChatEnabled, isGenAIGiftFinderEnabled } =
        Sephora.configurationSettings;

    const CATEGORIES_AVAILABLE = [
        ...Categories.GENAI_CATEGORIES_HAIR,
        ...Categories.GENAI_CATEGORIES_SKINCARE,
        ...Categories.GENAI_CATEGORIES_MAKEUP
    ];

    if (isGenAIFragranceChatEnabled) {
        CATEGORIES_AVAILABLE.push(...Categories.GENAI_CATEGORIES_FRAGRANCE);
    }

    if (isGenAIBathAndBodyChatEnabled) {
        CATEGORIES_AVAILABLE.push(...Categories.GENAI_CATEGORIES_BATH_AND_BODY);
    }

    if (isGenAIToolsAndBrushesChatEnabled) {
        CATEGORIES_AVAILABLE.push(...Categories.GENAI_CATEGORIES_TOOLS_AND_BRUSHES);
    }

    if (isGenAIGiftFinderEnabled) {
        CATEGORIES_AVAILABLE.push(...Categories.GENAI_CATEGORIES_GIFT);
    }

    return CATEGORIES_AVAILABLE;
}

function isAIBeautyChatEnabledPDP(product) {
    if (!product || !product.parentCategory) {
        return false;
    }

    const { isGenAIChatPDPEnabled } = Sephora.configurationSettings;

    const AVAILABLE_CATEGORIES = getAllAvailableCategories();

    if (hasCategoryId(product.parentCategory, AVAILABLE_CATEGORIES) && isGenAIChatPDPEnabled) {
        return true;
    }

    return false;
}

function isAIBeautyChatGiftFinderEnabledPDP(product) {
    if (!product || !product.parentCategory) {
        return false;
    }

    const AVAILABLE_CATEGORIES = Categories.GENAI_CATEGORIES_GIFT;

    if (hasCategoryId(product.parentCategory, AVAILABLE_CATEGORIES)) {
        return true;
    }

    return false;
}

function isAIBeautyChatEnabledPLP(categoryId) {
    if (!categoryId) {
        return false;
    }

    const { isGenAIChatPLPEnabled } = Sephora.configurationSettings;

    const AVAILABLE_CATEGORIES = getAllAvailableCategories();

    const enablePLP = AVAILABLE_CATEGORIES.some(category => category.id === categoryId);

    if (enablePLP && isGenAIChatPLPEnabled) {
        return true;
    }

    return false;
}

function isAIBeautyChatEnabledSRP(pageType) {
    if (pageType !== 'searchResults') {
        return false;
    }

    const { isGenAIChatSRPEnabled } = Sephora.configurationSettings;

    return isGenAIChatSRPEnabled;
}

function getUUID() {
    const token = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
    let uuid;

    if (token) {
        const tokenPayload = token.split('.')[1];
        const userTokenData = JSON.parse(atob(tokenPayload.replace(/-/g, '+').replace(/_/g, '/')));

        if (userTokenData?.AuthData?.uuid) {
            uuid = JSON.stringify(userTokenData?.AuthData?.uuid).replace(/\"/g, '');
        }
    }

    return uuid;
}

function getAnonymousId() {
    const storedAnonymousId = getGENAIAnonymousId();

    if (storedAnonymousId) {
        return storedAnonymousId;
    }

    const uuid = getUUID();

    if (uuid) {
        setGENAIAnonymousId(uuid);

        return uuid;
    }

    const generatedUUID = UUIDv4();
    setGENAIAnonymousId(generatedUUID);

    return generatedUUID;
}

function isAIBeautyGiftEnabled(categoryId) {
    if (!categoryId) {
        return false;
    }

    const AVAILABLE_CATEGORIES = Categories.GENAI_CATEGORIES_GIFT;

    const enablePLP = AVAILABLE_CATEGORIES.some(category => category.id === categoryId);

    return enablePLP;
}

export {
    isAIBeautyChatEnabledPDP,
    isAIBeautyChatEnabledPLP,
    isAIBeautyChatEnabledSRP,
    getUUID,
    getAnonymousId,
    isAIBeautyGiftEnabled,
    isAIBeautyChatGiftFinderEnabledPDP
};
