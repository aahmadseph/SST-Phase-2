/* eslint-disable no-console */
// eslint-disable-next-line no-undef
const browser = chrome;

//CONSTANTS
const NORMAL_HEADER_RULE_ID = 100;
const INCOGNITO_HEADER_RULE_ID = 200;

const C3_MIRROR_URL_PATH = '/C3Mirror';
const RESPONSE_HEADERS = {
    AGENTTIER: 'agenttier',
    LOCATION: 'location',
    XLOCATION: 'x-redirect-location',
    SEPH_ACCESS_TOKEN: 'seph-access-token',
    REFRESH_ACCESS_TOKEN: 'refresh-access-token',
    ATG_ID: 'atgid',
    BI_ID: 'biid'
};
const STORAGE_KEYS = {
    MIRROR: 'mirror',
    INCOGNITO_MIRROR: 'incognitoMirror',
    AGENT_MIRROR: 'agentStorage',
    AGENT_INCOGNITO_MIRROR: 'incognitoAgentStorage'
};

const initialContextStorageData = {
    id: '',
    origin: '',
    agenttier: '',
    accessToken: '',
    refreshToken: '',
    atgId: '',
    biId: ''
};

const initialStorage = {
    [STORAGE_KEYS.MIRROR]: initialContextStorageData,
    [STORAGE_KEYS.INCOGNITO_MIRROR]: initialContextStorageData
};

const SEPHORA_DOMAINS = [
    'https://www.sephora.com',
    'https://qa3.sephora.com',
    'https://qa4.sephora.com',
    'https://sitetraining.sephora.com',
    'https://perf1.sephora.com'
];

//UTILS
const getContext = () => ({
    storageKey: browser.extension.inIncognitoContext ? STORAGE_KEYS.INCOGNITO_MIRROR : STORAGE_KEYS.MIRROR,
    ruleId: browser.extension.inIncognitoContext ? INCOGNITO_HEADER_RULE_ID : NORMAL_HEADER_RULE_ID,
    agentContextStorageKey: browser.extension.inIncognitoContext ? STORAGE_KEYS.AGENT_INCOGNITO_MIRROR : STORAGE_KEYS.AGENT_MIRROR
});

const getContextStorageData = async () => {
    try {
        const { storageKey } = getContext();
        const result = await browser.storage.local.get(storageKey);

        return result[storageKey];
    } catch (error) {
        throw new Error('Error getting the context storage data', { cause: error });
    }
};

const getAgentFromStorageData = async () => {
    try {
        const { agentContextStorageKey } = getContext();
        const result = await browser.storage.local.get(agentContextStorageKey);

        return result[agentContextStorageKey];
    } catch (error) {
        throw new Error('Error getting the context storage data', { cause: error });
    }
};

const setContextStorageData = async (values = initialContextStorageData) => {
    try {
        const { storageKey } = getContext();

        await browser.storage.local.set({ [storageKey]: { ...values } });
    } catch (error) {
        throw new Error('Error setting in extension storage data', { cause: error });
    }
};

const addAgentContextStorageData = async values => {
    if (values) {
        try {
            const { agentContextStorageKey } = getContext();
            await browser.storage.local.set({ [agentContextStorageKey]: { ...values } });
        } catch (error) {
            throw new Error('Error adding agent info in extension storage data', { cause: error });
        }
    }
};

const addAgenttierHeaderToContextRequests = async agenttier => {
    try {
        const { ruleId } = getContext();

        //Assign to all the https request inside the sessionId tab the agenttier header.

        await browser.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [ruleId],
            addRules: [
                {
                    id: ruleId,
                    action: {
                        type: 'modifyHeaders',
                        requestHeaders: [
                            {
                                header: 'agenttier',
                                operation: 'set',
                                value: agenttier
                            }
                        ]
                    },
                    condition: {
                        urlFilter: '*://*.sephora.com/*',
                        resourceTypes: [
                            'main_frame',
                            'sub_frame',
                            'stylesheet',
                            'script',
                            'image',
                            'font',
                            'object',
                            'xmlhttprequest',
                            'ping',
                            'csp_report',
                            'media',
                            'websocket',
                            'webtransport',
                            'webbundle',
                            'other'
                        ]
                    },
                    priority: 1
                }
            ]
        });
    } catch (error) {
        throw new Error('Error adding agenttier header to context requests', { cause: error });
    }
};

function loadUrlInTab(tabId, url) {
    browser.tabs.update(tabId, { url: url }, () => {
        if (browser.runtime.lastError) {
            console.error('Error loading URL:', browser.runtime.lastError);
        }
    });
}

const removeAgenttierHeaderFromContextRequests = async () => {
    try {
        const { ruleId } = getContext();
        await browser.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [ruleId]
        });
    } catch (error) {
        throw new Error('Error removing agenttier header from context requests', { cause: error });
    }
};

const addCookie = async (cookieName, value, origin) => {
    try {
        await browser.cookies.set({
            name: cookieName,
            value: value,
            url: origin
        });
    } catch (error) {
        throw new Error('Error adding ccpaConsentCookie', { cause: error });
    }
};

const removeCookie = async (cookieName, origin) => {
    try {
        const cookie = await browser.cookies.get({
            name: cookieName,
            url: origin
        });

        if (cookie) {
            const protocol = cookie.secure ? 'https:' : 'http:';
            const fullCookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

            await browser.cookies.remove({
                url: fullCookieUrl,
                name: cookie.name,
                storeId: cookie.storeId
            });
        }
    } catch (error) {
        throw new Error(`Error removing cookie ${cookieName}`, { cause: error });
    }
};

//SCRIPTS
function setLocalStorageData(accessToken, refreshToken, atgId, biId, profileSecurityStatus, expiryAccess, expiryRefresh, agentInfo) {
    const setLocalStorageItem = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    if (accessToken && refreshToken) {
        setLocalStorageItem('accessToken', { data: accessToken, expiry: expiryAccess });
        setLocalStorageItem('refreshToken', { data: refreshToken, expiry: expiryRefresh });
    }

    if (atgId && biId) {
        setLocalStorageItem('profileId', { data: atgId, expiry: expiryAccess });
        setLocalStorageItem('biAccountId', { data: biId, expiry: expiryAccess });
        setLocalStorageItem('profileSecurityStatus', { data: profileSecurityStatus, expiry: expiryAccess });
    }
    if (agentInfo) {
        setLocalStorageItem('agentInfo', agentInfo);
    }
}

function expireSession() {
    // clear localStorage
    window.localStorage.clear();
}

const insertReactApp = async tabId => {
    try {
        browser.scripting.insertCSS({
            target: { tabId },
            files: ['styles.css']
        });
        await browser.scripting.executeScript({
            target: { tabId },
            files: ['content.js'],
            injectImmediately: true
        });
    } catch (e) {
        throw new Error('Error Inserting React App', { cause: e });
    }
};

const insertIsAgentAuthorizedRoleUtil = async (accessToken = false, agenttier, tabId) => {
    function insertUtilToWindow(token, tier) {
        let agenttierValue;

        //New flow C3 with tokens decode the agenttier from JWT
        if (token) {
            const tokenInfo = token.split('.');
            const payload = JSON.parse(atob(tokenInfo[1]));

            if (payload && payload.AuthData && payload.AuthData.role) {
                agenttierValue = payload.AuthData.role;
            }
            //Old flow CSC doesn't take into account tokens
        } else if (tier) {
            agenttierValue = tier;
        }

        if (window.Sephora) {
            window.Sephora.isAgentAuthorizedRole = agentierArray => {
                return agentierArray?.includes(agenttierValue);
            };
        }
    }

    try {
        await browser.scripting.executeScript({
            target: { tabId },
            func: insertUtilToWindow,
            args: [accessToken, agenttier],
            world: 'MAIN',
            injectImmediately: true
        });
    } catch (e) {
        throw new Error('Error Inserting Sephora.isAgentAuthorizedRole util', { cause: e });
    }
};

const sentSephoraGlobalToReactApp = async tabId => {
    function sentSephoraByMessage() {
        if (window.Sephora) {
            window.postMessage({ type: 'SEPHORA_GLOBAL', value: JSON.stringify(window.Sephora) });
        }
    }

    try {
        await browser.scripting.executeScript({
            target: { tabId },
            func: sentSephoraByMessage,
            world: 'MAIN'
        });
    } catch (e) {
        throw new Error('Error Sending Sephora object to extension', { cause: e });
    }
};

const initializeExtension = async tabId => {
    const { id, origin, agenttier, accessToken } = await getContextStorageData();

    if (tabId !== id) {
        return;
    }

    try {
        await insertReactApp(tabId);
        await insertIsAgentAuthorizedRoleUtil(accessToken, agenttier, tabId);
        await sentSephoraGlobalToReactApp(tabId);
        await addCookie('ccpaConsentCookie', '1', origin);
    } catch (error) {
        throw new Error('Error Initializing the extension', { cause: error });
    }
};

function decodeJWT(token) {
    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error('Invalid access/refresh tokens');
    }

    // Base64URL decode the header and payload
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    return { header, payload };
}

const getHeader = (details, headerName) =>
    details?.responseHeaders?.find(header => {
        return header.name.toLowerCase() === headerName;
    });

const initAgentAwareSession = async details => {
    const agentTierHeader = getHeader(details, RESPONSE_HEADERS.AGENTTIER);

    const locationHeader = getHeader(details, RESPONSE_HEADERS.LOCATION) || getHeader(details, RESPONSE_HEADERS.XLOCATION);

    const accessTokenHeader = getHeader(details, RESPONSE_HEADERS.SEPH_ACCESS_TOKEN);

    const refreshTokenHeader = getHeader(details, RESPONSE_HEADERS.REFRESH_ACCESS_TOKEN);

    const atgIdHeader = getHeader(details, RESPONSE_HEADERS.ATG_ID);

    const biIdHeader = getHeader(details, RESPONSE_HEADERS.BI_ID);

    const redirectionOriginUrl = new URL(details.url);

    const tokenDecoded = decodeJWT(accessTokenHeader?.value);

    const profileSecurityStatus = tokenDecoded.payload.AuthData.profileSecurityStatus;

    const expiryAccess = tokenDecoded.payload.exp;

    const expiryRefresh = decodeJWT(refreshTokenHeader?.value).payload.exp;

    if (redirectionOriginUrl?.pathname.startsWith(C3_MIRROR_URL_PATH) && (!accessTokenHeader || !refreshTokenHeader)) {
        throw new Error('AccessToken or RefreshToken header are not present in Mirror response');
    }

    if (agentTierHeader && locationHeader && atgIdHeader && biIdHeader) {
        const url = new URL(locationHeader.value);
        const { agentInfo } = await getAgentFromStorageData();
        //When redirection is confirmed with agenttier value and there is a previous active session, then execute a script
        //in that tab to expire that session and be prepared for new session

        const contextData = {
            agenttier: agentTierHeader.value,
            id: details.tabId,
            origin: url.origin,
            atgId: atgIdHeader.value,
            biId: biIdHeader.value
        };

        if (accessTokenHeader && refreshTokenHeader) {
            contextData.accessToken = accessTokenHeader.value;
            contextData.refreshToken = refreshTokenHeader.value;
        }

        //When redirection is confirmed with agenttier value then start the active session assigning extension storage values

        try {
            //Insert local storage data at this point.
            //Otherwise it will be to late and Sephora.com will not read it

            await browser.scripting.executeScript({
                target: { tabId: details.tabId },
                func: setLocalStorageData,
                injectImmediately: true,
                args: [
                    accessTokenHeader?.value || false,
                    refreshTokenHeader?.value || false,
                    atgIdHeader.value,
                    biIdHeader.value,
                    profileSecurityStatus || 0,
                    expiryAccess,
                    expiryRefresh,
                    agentInfo
                ]
            });
        } catch (error) {
            console.error(`Trying to insert Local storage at ${details.tabId}`);
        }

        await setContextStorageData(contextData);
        //If /c3mirror response is 200 and not 302, redirect manually to the mirror site

        if (details.statusCode === 200) {
            loadUrlInTab(details.tabId, locationHeader.value);
        }
    } else {
        throw new Error('Agenttier/Location/AtgId/BiId header is not present in Redirect response');
    }
};

//EXTENSION RUNTIME

//1. Every time the extension gets installed or reloaded this is going to set the initial storage.
browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set(initialStorage);
});

//2. The service worker starts listening  for a redirection from CSC
browser.webRequest.onHeadersReceived.addListener(
    initAgentAwareSession,
    {
        urls: [
            '*://*.sephora.com/aas?_DARGS=/CSC/redirection/redirectToSephora.jsp',
            '*://*.sephora.com/aas/?_DARGS=/CSC/redirection/redirectToSephora.jsp',
            `*://*.sephora.com${C3_MIRROR_URL_PATH}`
        ]
    },
    ['responseHeaders']
);

//3. Service Worker Start Listening for Full Profile API Call to Initialize Extension
browser.webRequest.onCompleted.addListener(
    async details => {
        if (details.tabId) {
            await initializeExtension(details.tabId);
        }
    },
    { urls: ['*://*.sephora.com/api/users/profiles/current/full*', '*://*.sephora.com/gapi/users/profiles/*'] }
);

//3. The service worker starts listening for updates on Chrome tabs to Initialize Extension.
browser.tabs.onUpdated.addListener(async (...args) => {
    const [, , tab] = args;

    if (tab && tab.id) {
        await initializeExtension(tab.id);
    }
});

//4. The service worker starts listening for the session tab to be removed
const tabRemovedListner = async tabId => {
    const { id, origin } = await getContextStorageData();

    if (tabId === id) {
        //4.1 When service worker confirm that the tab being removed is the one with the session active
        // then it will close the session and remove headers. The session is reactivated when a new redirection is confirmed
        await clearExistingTabs();
        await setContextStorageData();
        await removeAgenttierHeaderFromContextRequests();
        //4.2 When tab with session is removed then remove the ccpaConsentCookie to don't affect normal Sephora.com behavior.

        await removeCookie('ccpaConsentCookie', origin);
    }
};
browser.tabs.onRemoved.addListener(tabRemovedListner);

//5. Add listeners for messages coming from content.js (React App)
browser.runtime.onMessage.addListener(function (request, sender) {
    //5.1 Add ability to close a tab from content.js (React application) injected in Sephora.com pages
    if (request.message === 'CloseTab') {
        browser.tabs.remove(sender.tab.id);
    }

    return true;
});

async function closeAndInvalidateExistingTab() {
    const { id, origin } = await getContextStorageData();
    if (!id) {
        return;
    }
    try {
        //Remove listner before removing the tab to avaid unwanted race conditions.
        browser.tabs.onRemoved.removeListener(tabRemovedListner);
        Promise.all([
            browser.scripting.executeScript({
                target: { tabId: id },
                func: expireSession,
                injectImmediately: true
            }),
            browser.tabs.remove(id),
            removeCookie('ccpaConsentCookie', origin),
            setContextStorageData(),
            removeAgenttierHeaderFromContextRequests()
        ]);
        //Add the listner back to keep listening to if users  closses the tab manually
        browser.tabs.onRemoved.addListener(tabRemovedListner);
    } catch (error) {
        console.error(`Trying to close tab ${id} but doesn't exist`, { cause: error });
    }
}

async function clearExistingTabs() {
    try {
        await browser.browsingData.remove(
            {
                origins: SEPHORA_DOMAINS
            },
            {
                cacheStorage: true,
                cookies: true,
                fileSystems: true,
                indexedDB: true,
                localStorage: true
            }
        );
    } catch (error) {
        console.error('Error clearing tabs:', error);
    }
}

browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    try {
        switch (message.type) {
            case 'buttonClicked':
                await clearExistingTabs();
                await closeAndInvalidateExistingTab();
                await addAgenttierHeaderToContextRequests(message.agentDetails?.agenttier?.toString());
                await addAgentContextStorageData({ agentInfo: message.agentDetails });
                sendResponse({ response: 'Cleared current session' });
                break;
            default:
        }
    } catch (e) {
        throw new Error('Error initializing mirror', e);
    }

    return true;
});
