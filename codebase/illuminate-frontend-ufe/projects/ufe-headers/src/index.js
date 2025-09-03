/* eslint no-console: 0 */
/* eslint-globals chrome: true */
// this is used to get page info for hard page loads
// this does not work well on SPA page loads
async function getPageInfo() {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const sparts = scripts
        .filter(script => {
            return (
                !script.src &&
                script.innerHTML.indexOf('Sephora.renderedData') > -1 &&
                script.innerHTML.indexOf('Sephora.renderedData.pageRenderTime') < 0
            );
        })
        .map(script => {
            return script.innerHTML.split('Sephora.');
        });

    if (sparts.length < 1) {
        return Promise.resolve('index.js - info: We are NOT done!');
    }

    const template = sparts[0]
        .find(s => s.indexOf('template') > -1)
        ?.replace('template', '')
        ?.replace(/^ = /, '')
        ?.replace(/\"/g, '')
        ?.replace(/\;$/, '');

    const fparts = sparts[0]
        .filter(eleObj => {
            return eleObj.indexOf('renderedData') > -1 || eleObj.indexOf('buildInfo') > -1 || eleObj.indexOf('renderQueryParams') > -1;
        })
        .map(eleObj => {
            return eleObj.replace(/renderedData|buildInfo|renderQueryParams/, '');
        })
        .map(eleObj => {
            const data = eleObj.replace(/^ = /, '').replace(/\;$/, '');
            try {
                return JSON.parse(data);
            } catch (e) {
                return {};
            }
        });

    if (fparts.length > 0) {
        const parts = fparts.reduce((acc, next) => {
            const results = Object.assign({}, acc, next);
            delete results.channelProp;
            delete results['PROJECT_VERSION'];

            if (results.urlPath) {
                results['URL Path'] = decodeURIComponent(decodeURIComponent(window.location.pathname));
                const search = window.location.search;
                const cleanSearch = search && search.length > 1 ? `${search}`.substring(1) : '';
                results['Query Params'] = decodeURIComponent(decodeURIComponent(cleanSearch));
                delete results.urlPath;
            }

            if (results.catOrMouse) {
                results['TOM or JERRI'] = results.catOrMouse === 'cat' ? 'TOM' : 'JERRI';
                delete results.catOrMouse;
            }

            if (results.renderHost) {
                const isAKS = results.renderHost === 'localhost';

                if (!isAKS) {
                    results['UFE host'] = results.renderHost;
                }

                if (results['TOM or JERRI'] === 'JERRI') {
                    results['TOM or JERRI'] = `JERRI ${isAKS ? 'in AKS' : 'in IaaS/VM'}`;
                }

                delete results.renderHost;
            }

            if (results.channel && results.country && results.language) {
                results['Channel / Country / Language'] = `${results.channel} / ${results.country} / ${results.language}`;
                delete results.channel;
                delete results.country;
                delete results.language;
            }

            return results;
        });
        // cookies
        const cookieJar = document.cookie.split(/; /);

        // which akamweb?
        const akamwebCookie = cookieJar
            .filter(cookie => {
                return cookie.indexOf('akamweb') > -1;
            })
            .map(cookie => {
                const value = cookie.replace('akamweb=', '');
                let origin = 'mystery';

                if (value.toUpperCase() === 'E') {
                    origin = 'Canary';
                } else if (value.toUpperCase() === 'C') {
                    origin = 'None Canary';
                } else if (value.toUpperCase() === 'H') {
                    origin = 'AZ2';
                }

                return `${value} (${origin})`;
            });
        parts['akamweb'] = akamwebCookie.length > 0 ? akamwebCookie[0] : '';

        // dynatrace
        const isDynatraceEnabled = scripts.filter(script => {
            return script.src && script.src.indexOf('ruxitagentjs') > -1;
        });
        parts['Dynatrace Enabled'] = isDynatraceEnabled.length > 0;

        // PIM hope this is the only resources script
        const isPIMEnabled = scripts.filter(script => {
            return script.src && script.src.indexOf('sephora.com/resources/') > -1;
        });
        parts['PIM Enabled'] = isPIMEnabled.length > 0;
        parts.template = template;

        console.log('index.js - info: Got page info!');
        chrome.runtime
            .sendMessage({
                name: 'pageLoadInfo',
                value: parts,
                pageLoadInfo: parts
            })
            .then(_result => {
                if (!chrome.runtime.lastError) {
                    console.debug('index.js - info: Success sending');
                } else {
                    console.error('index.js - error: Failed sending!', chrome.runtime.lastError);
                }
            })
            .catch(e => {
                console.error('index.js - error: Failed sending!', e, chrome.runtime.lastError);
            });
    }

    return Promise.resolve('index.js - info: We are done!');
}

getPageInfo();
chrome.runtime.onMessage.addListener(async msg => {
    if (msg.getPageInfo) {
        return getPageInfo();
    } else {
        return Promise.resolve('index.js - info: Nothing to do!');
    }
});
