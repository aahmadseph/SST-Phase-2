import Storage from 'utils/localStorage/Storage';

const SESSION_EXPIRY = Storage.DAYS * 60;
const SUPERCHAT_CONFIG_EXPIRY = Storage.DAYS * 1;
const ANONYMOUS_EXPIRY = Storage.DAYS * 7;

const KEYS = {
    GENAI_SESSION_KEY: 'GENAI_SESSION',
    GENAI_ANONYMOUS_ID_KEY: 'GENAI_ANONYMOUS_ID',
    SUPERCHAT_CONFIG_KEY: 'SUPERCHAT_CONFIG'
};

const setGENAISession = dataSession => {
    const session = JSON.stringify(dataSession);
    Storage.local.setItem(KEYS.GENAI_SESSION_KEY, session, SESSION_EXPIRY);
};

const setSuperChatConfig = config => {
    try {
        Storage.local.setItem(KEYS.SUPERCHAT_CONFIG_KEY, JSON.stringify(config), SUPERCHAT_CONFIG_EXPIRY);
    } catch (error) {
        Sephora.logger.error('SuperChat: Error creating Super Chat Config in LocalStorage');
    }
};

const setGENAIAnonymousId = anonymousId => {
    Storage.local.setItem(KEYS.GENAI_ANONYMOUS_ID_KEY, anonymousId, ANONYMOUS_EXPIRY);
};

const getGENAISession = () => {
    const existingSession = Storage.local.getItem(KEYS.GENAI_SESSION_KEY);

    if (!existingSession) {
        return null;
    }

    return JSON.parse(existingSession);
};

const getSuperChatConfig = () => {
    const existingConfig = Storage.local.getItem(KEYS.SUPERCHAT_CONFIG_KEY);

    try {
        return JSON.parse(existingConfig);
    } catch (error) {
        return null;
    }
};

const getGENAIAnonymousId = () => {
    return Storage.local.getItem(KEYS.GENAI_ANONYMOUS_ID_KEY);
};

const removeSuperChatConfig = () => {
    try {
        Storage.local.removeItem(KEYS.SUPERCHAT_CONFIG_KEY);
    } catch (error) {
        Sephora.logger.error('SuperChat: Error removing Super Chat Config from LocalStorage');
    }
};

const removeGENAISession = () => {
    Storage.local.removeItem(KEYS.GENAI_SESSION_KEY);
};

const removeGENAIAnonymousId = () => {
    Storage.local.removeItem(KEYS.GENAI_ANONYMOUS_ID_KEY);
};

export {
    setGENAISession,
    setGENAIAnonymousId,
    setSuperChatConfig,
    getGENAISession,
    getSuperChatConfig,
    removeSuperChatConfig,
    getGENAIAnonymousId,
    removeGENAISession,
    removeGENAIAnonymousId,
    KEYS
};
