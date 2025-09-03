/* eslint object-curly-newline: 0, no-console: 0, ssr-friendly/no-dom-globals-in-module-scope: 0 */

const lastCacheData = {};

let lastDomain;

function handleMessageError(_resp) {
    if (!chrome.runtime.lastError) {
        console.log('menu-options.js - info: Success sending');
    } else {
        console.log('menu-options.js - error: Failed sending!', chrome.runtime.lastError);
    }
}

function handleTabsMessageError(_resp) {
    if (!chrome.runtime.lastError) {
        console.log('menu-options.js - info: TABS Success sending');
    } else {
        console.log('menu-options.js - error: TABS Failed sending!', chrome.runtime.lastError);
    }
}

function handleCookieError(_resp) {
    if (!chrome.runtime.lastError) {
        console.log('menu-options.js - info: Success setting cookie');
    } else {
        console.log('menu-options.js - error: Failed setting cookie!', chrome.runtime.lastError);
    }
}

function setACookie(name, value) {
    if (!lastDomain) {
        lastDomain = window.localStorage.getItem('lastDomain');

        if (!lastDomain) {
            return;
        }
    }

    chrome.cookies.set(
        {
            name: name,
            value: value,
            path: '/',
            secure: true,
            url: `https://${lastDomain}`
        },
        handleCookieError
    );
}

function setCookies(ctry, lang) {
    setACookie('site_locale', ctry);
    setACookie('site_language', lang);
}

// use chrome.cookies?
/*
function updateFormDisplay(msg) {
    const countryLanguage = document.getElementById('country-language'),
        mobileDesktop = document.getElementById('mobile-desktop'),
        enableAkamaiHeaders = document.getElementById('enable-akamai-headers');

    if (msg['country-language']) {
        const val = msg['country-language'].toUpperCase();
        // default to ca ?
        let idx = 0;

        if (val === 'US-EN') {
            idx = 1;
            setCookies('us', 'en');
        } else if (val === 'CA-EN') {
            idx = 2;
            setCookies('ca', 'en');
        } else if (val === 'CA-FR') {
            idx = 3;
            setCookies('ca', 'fr');
        }

        countryLanguage.selectedIndex = idx;
    }

    if (msg['mobile-desktop']) {
        let idx = 0;

        if (msg['mobile-desktop'] === 'MW') {
            idx = 2;
            setACookie('device_type', 'mobile');
        } else if (msg['mobile-desktop'] === 'FS') {
            idx = 1;
            setACookie('device_type', 'desktop');
        }

        mobileDesktop.selectedIndex = idx;
    }

    if (msg['enable-akamai-headers']) {
        const isBoolean = (typeof msg['enable-akamai-headers'] === 'boolean');
        const isTruthy = (isBoolean && msg['enable-akamai-headers']);
        enableAkamaiHeaders.checked = (isTruthy || msg['enable-akamai-headers'] === 'checked' ? 'checked' : undefined);
    }
}
*/

async function updateDisplay(msg) {
    if (msg['response-headers']) {
        const data = msg['response-headers'];
        let results = '';
        Object.keys(data)
            .filter(keys => {
                const item = data[keys];

                if (item['content-type']) {
                    if (item['content-type'].indexOf('text/html') > -1 || item['content-type'].indexOf('application/json') > -1) {
                        return true;
                    }
                }

                return false;
            })
            .forEach(key => {
                const parsedUrl = new URL(key);
                const headers = data[key];
                let next = '<table><tr><th>Name</th><th>Value</th></tr>';
                Object.keys(headers).forEach(hkey => {
                    next += `<tr><td>${hkey}</td><td>${headers[hkey]}</td></tr>`;
                });
                next += '</table>';
                const host = `<br>Host: ${parsedUrl.host}`;
                lastDomain = parsedUrl.host;
                window.localStorage.setItem('lastDomain', lastDomain);
                const urlpath = `<br>Path: <span id="parsedPath">${parsedUrl.pathname}</span>`;
                const searchParams = '<br>Query Params: <span id="parsedParams"></span>';
                results += `${host}${urlpath}${searchParams}<br>${next}`;
                lastCacheData[key] = results;
            });
        results += '</table>';
        const container = document.getElementById('cache-header-data');
        container.innerHTML = results;
    }

    if (msg['pageLoadInfo']) {
        const pageLoadInfo = document.getElementById('page-load-info');
        const pageLoadInfoData = msg['pageLoadInfo'];
        const pageKeys = Object.keys(pageLoadInfoData);

        function checkKey(a, b, keyIn) {
            if (a.startsWith(keyIn)) {
                return -1;
            } else if (b.startsWith(keyIn)) {
                return 1;
            }

            return 0;
        }

        pageKeys.sort((a, b) => {
            let keyCheck = checkKey(a, b, 'BUILD_DATE');

            if (keyCheck !== 0) {
                return keyCheck;
            }

            keyCheck = checkKey(a, b, 'BUILD_NUMBER');

            if (keyCheck !== 0) {
                return keyCheck;
            }

            keyCheck = checkKey(a, b, 'CODE_BRANCH');

            if (keyCheck !== 0) {
                return keyCheck;
            }

            keyCheck = checkKey(a, b, 'GIT_BRANCH');

            if (keyCheck !== 0) {
                return keyCheck;
            }

            keyCheck = checkKey(a, b, 'GIT_COMMIT');

            if (keyCheck !== 0) {
                return keyCheck;
            }

            return a === b;
        });
        let urlPath = '',
            queryPath = '';
        const jsonPageResults = pageKeys
            .map(key => {
                if (key === 'URL Path') {
                    urlPath = pageLoadInfoData[key];
                } else if (key === 'Query Params') {
                    queryPath = pageLoadInfoData[key];
                }

                return `<tr><td>${key}</td><td>${pageLoadInfoData[key]}</td></tr>`;
            })
            .reduce((acc, next) => {
                return acc + next;
            });
        pageLoadInfo.innerHTML = `<table>${jsonPageResults}</table>`;
        const parsedPathObj = document.getElementById('parsedPath');

        if (parsedPathObj && parsedPathObj.innerHTML !== urlPath) {
            parsedPathObj.innerHTML = urlPath;
        }

        const parsedParamsObj = document.getElementById('parsedParams');

        if (parsedParamsObj && queryPath && queryPath.length > 0) {
            parsedParamsObj.innerHTML = queryPath;
        }
    }

    return Promise.resolve('menu-options.js - info: update display done!');
}

chrome.runtime.onMessage.addListener(updateDisplay);

function safelyParse(inVar) {
    try {
        return JSON.parse(inVar);
    } catch (e) {
        return inVar;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const countryLanguage = document.getElementById('country-language'),
        mobileDesktop = document.getElementById('mobile-desktop'),
        enableAkamaiHeaders = document.getElementById('enable-akamai-headers');

    const akamai = window.localStorage.getItem('enable-akamai-headers');
    const message = {};

    if (akamai) {
        message['enable-akamai-headers'] = akamai;
        message.showMeTheData = true;
        const isBoolean = typeof safelyParse(akamai) === 'boolean';
        const isTruthy = isBoolean && safelyParse(akamai);
        enableAkamaiHeaders.checked = isTruthy || akamai === 'checked' ? 'checked' : undefined;
        updateDisplay(message);
    }

    chrome.runtime
        .sendMessage(message)
        .then(handleMessageError)
        .catch(e => {
            console.log('menu-options.js - error: on load caught error!', e, chrome.runtime.lastError);
        });
    chrome.tabs
        .query({
            active: true,
            currentWindow: true
        })
        .then(tabs => {
            const msg = {
                getPageInfo: true
            };
            tabs.forEach(tab => {
                chrome.tabs
                    .sendMessage(tab.id, msg)
                    .then(_res => {
                        handleTabsMessageError();
                    })
                    .catch(err => {
                        console.log('menu-options.js - error: on load caught error!', err, chrome.runtime.lastError);
                    });
            });
        })
        .catch(err => {
            console.log('menu-options.js - error: on load caught error!', err, chrome.runtime.lastError);
        });

    const countryLang = window.localStorage.getItem('country-language');

    if (countryLang && countryLanguage) {
        const result = Array.from(countryLanguage.options).find(option => {
            return option.value === countryLang;
        });

        if (result.index > 0) {
            countryLanguage.selectedIndex = result.index;
        }
    }

    const mwebFS = window.localStorage.getItem('mobile-desktop');

    if (mwebFS && mobileDesktop) {
        const result = Array.from(mobileDesktop.options).find(option => {
            return option.value === mwebFS;
        });

        if (result.index > 0) {
            mobileDesktop.selectedIndex = result.index;
        }
    }

    countryLanguage.addEventListener('change', evt => {
        const target = evt.target;
        const idx = target.selectedIndex;
        const val = target.options[idx].value;
        window.localStorage.setItem(target.id, val);
        const [ctry, lang] = val.toLowerCase().split('-');
        chrome.runtime
            .sendMessage({
                name: target.id,
                value: val
            })
            .then(handleMessageError)
            .catch(e => {
                console.log('menu-options.js - error: country / language caught error!', e, chrome.runtime.lastError);
            });
        setCookies(ctry, lang);
    });

    mobileDesktop.addEventListener('change', evt => {
        const target = evt.target;
        const idx = target.selectedIndex;
        const val = target.options[idx].value;
        window.localStorage.setItem(target.id, val);
        const mobileDesktopVal = val === 'MW' ? 'mobile' : 'desktop';
        chrome.runtime
            .sendMessage({
                name: target.id,
                value: val
            })
            .then(handleMessageError)
            .catch(e => {
                console.log('menu-options.js - error: mobile / desktop caught error!', e, chrome.runtime.lastError);
            });
        setACookie('device_type', mobileDesktopVal);
    });

    enableAkamaiHeaders.addEventListener('change', evt => {
        const target = evt.target;
        target.checked = target.checked ? 'checked' : '';

        if (target.checked) {
            window.localStorage.setItem(target.id, target.checked);
        } else {
            window.localStorage.removeItem(target.id);
        }

        chrome.runtime
            .sendMessage({
                name: target.id,
                value: target.checked
            })
            .then(handleMessageError)
            .catch(e => {
                console.log('menu-options.js - error: akamai caught error!', e, chrome.runtime.lastError);
            });
    });

    return Promise.resolve('menu-options.js - info: onloaded done!');
});
