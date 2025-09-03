/* eslint object-curly-newline: 0, no-console: 0 */
const URL_FILTER = {
    urls: ['http://*.sephora.com/*', 'https://*.sephora.com/*']
};

// these are the defaults
let enableAkamaiHeaders = false,
    akamaiHeaders = {},
    pageLoadInfoData;

const AKAMAI_RULE = {
    removeRuleIds: [1],
    addRules: [
        {
            id: 1,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                requestHeaders: [
                    {
                        header: 'X-IM-ImageManagerRequired',
                        operation: 'set',
                        value: 'true'
                    },
                    {
                        header: 'esconder-pragma',
                        operation: 'set',
                        value: 'true'
                    },
                    /*{
                    'header': 'agenttier',
                    'operation': 'set',
                    'value': '1'
                },*/
                    // akamai-x-get-extracted-values -> produces the X-Akamai-Session-Info headers, which is a lot of datas
                    {
                        header: 'pragma',
                        operation: 'set',
                        value: 'akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-nonces, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-get-request-id, akamai-x-get-client-ip'
                    }
                ]
            },
            condition: {
                urlFilter: '*.sephora.com',
                resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'other', 'script', 'image']
            }
        }
    ]
};

function handleMessageError(_resp) {
    if (!chrome.runtime.lastError) {
        console.log('main.js - info: Success sending');
    } else {
        console.log('main.js - error: Failed sending!', chrome.runtime.lastError);
    }

    akamaiHeaders = {};
}

function checkDetails() {
    //if (enableAkamaiHeaders) {
    chrome.declarativeNetRequest.updateDynamicRules(AKAMAI_RULE, results => {
        if (results) {
            console.log(results);
        }
    });
}

async function sendHeaders(msg = {}) {
    const respMsg = {};

    if (msg.name === 'enable-akamai-headers') {
        enableAkamaiHeaders = msg.value;
    }

    respMsg['enable-akamai-headers'] = enableAkamaiHeaders;
    respMsg['response-headers'] = Object.assign({}, akamaiHeaders);

    if (msg.name === 'pageLoadInfo') {
        pageLoadInfoData = msg.value;
        respMsg['pageLoadInfo'] = pageLoadInfoData;
    } else if (pageLoadInfoData) {
        respMsg['pageLoadInfo'] = pageLoadInfoData;
    }

    checkDetails();
    console.log('main.js - info: Listener callback!');
    chrome.runtime
        .sendMessage(respMsg)
        .then(handleMessageError)
        .catch(e => {
            console.log('main.js - error: callback caught error!', e, chrome.runtime.lastError);
        });

    return Promise.resolve('main.js - info: Before send, we are done!');
}

async function receivedHeaders(details) {
    const idx = details.url.indexOf(details.initiator);
    const url = new URL(details.url);
    const apiIdx = url.pathname.startsWith('/api/');

    if (!details.initiator || idx > -1 || apiIdx) {
        if (details.responseHeaders.length > 0) {
            // convert array to object
            const relevantHeaders = {};
            details.responseHeaders.forEach(item => {
                relevantHeaders[item.name] = item.value;
            });

            if (details.type === 'main_frame') {
                akamaiHeaders[details.url] = relevantHeaders;
            } else if (details.type === 'xmlhttprequest' && apiIdx) {
                akamaiHeaders[details.url] = relevantHeaders;
            }

            //console.log('main.js - info: Headers recieved!');
            sendHeaders();
        }
    }

    return Promise.resolve('main.js - info:Headers recieved we are done!');
}

chrome.runtime.onMessage.addListener(sendHeaders);

chrome.webRequest.onBeforeSendHeaders.addListener(checkDetails, URL_FILTER, ['requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener(receivedHeaders, URL_FILTER, ['extraHeaders', 'responseHeaders']);
