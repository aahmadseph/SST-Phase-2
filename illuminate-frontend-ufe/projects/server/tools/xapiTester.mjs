// to set environment variables before importing so they take effect
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

// Set SERVER_HOME to the server project directory
const baseDir = process.cwd();
process.env.SERVER_HOME = `${baseDir}/projects/server`;

const toolsDir = resolve(process.env.SERVER_HOME, 'tools');
const results = spawnSync('node', [`${toolsDir}/secreteKeys.mjs`]);
if (results.status === 0) {
    // lol my co-pilot wrote this for me`!
    readFileSync(`${process.env.SERVER_HOME}/tools/runProfiles/decrypted.sh`, 'utf-8').split('\n').forEach(line => {
        if (line.startsWith('export ')) {
            const keypair = line.replace('export ', '').split('=');
            process.env[keypair[0]] = keypair[1];
        }
    });
    spawnSync('rm', ['-f', `${process.env.SERVER_HOME}/tools/runProfiles/decrypted.sh`]);
}        

const main = async () => {
    const { httpsRequest, httpRequest } = await import('#server/services/utils/apiRequest.mjs');
    const {
        getError,
        stringifyMsg,
        safelyParse
    } = await import('#server/utils/serverUtils.mjs');
    const res = await import('#server/libs/Logger.mjs');
    const { withSdnToken } = await import('#server/services/api/oauth/sdn/withSdnToken.mjs');
    const getSdnToken = (await import('#server/services/api/oauth/sdn/getSdnToken.mjs')).default;

    const Logger = res.default;
    const filename = 'xapiTester.mjs';
    const logger = Logger(filename);


    const args = process.argv;

    if (args.length < 4 || args.includes('--help')) {
        logger.info('Please specify --host= and --path=, optionally --method=, --port=, --useHttp, --useGoogleBot, --showAkamaiHeaders --useSDNToken= --withSdnToken --body= --headers=');
        logger.info('Example:');
        logger.info(`
            ${'#'.repeat(40)}
            node tools/xapiTester.js
                --host=browseexpservice-prod.eus1-omni-prod.internalsephora.com 
                --port=443
                --method=GET
                --useHttp
                --useGoogleBot
                --showAkamaiHeaders
                --withSdnToken
                --path=/browseexpservice/v2/catalog/brands/dyson/seo
                --params='param1name=param1value&param2name=param2value'
                --headers='{ Accept: '' }'
                --body='this is the body of a message'
                --useSDNToken=<client id, for example UFE>
            ${'#'.repeat(40)}`);
        process.exit(-1);
    }

    let apiHost,
        apiPort = 443,
        apiPath = '/',
        params = '',
        method = 'GET',
        isChrome = false,
        showAkamaiHeaders = false,
        useHttp = false,
        sdnClientId,
        withSdnTokenKeys = false,
        postdata,
        headers = {};
    for (let i = 0, end = args.length; i < end; i++) {
        const arg = args[i];
        if (arg.startsWith('--host=')) {
            apiHost = arg.split('--host=')[1];
        } else if (arg.startsWith('--port=')) {
            apiPort = arg.split('--port=')[1];
        } else if (arg.startsWith('--path=')) {
            apiPath = arg.split('--path=')[1];
        } else if (arg.startsWith('--params=')) {
            params = arg.split('--params=')[1];
        } else if (arg.startsWith('--method=')) {
            method = arg.split('--method=')[1];
        } else if (arg.startsWith('--useGoogleBot')) {
            isChrome = true;
        } else if (arg.startsWith('--useSDNToken=')) {
            sdnClientId = arg.split('--useSDNToken=')[1];
        } else if (arg.startsWith('--body')) {
            postdata = arg.split('--body=')[1];
        } else if (arg.startsWith('--withSdnToken')) {
            withSdnTokenKeys = true;
        } else if (arg.startsWith('--headers')) {
            const value = arg.split('--headers=')[1].replace(/'/g, '"');
            headers = safelyParse(value, false) || {};
        }
    }
    const apiEndpoint = `${apiPath}?${params}`;

    logger.info(`Calling ${apiHost}:${apiPort}${apiEndpoint} with method ${method}`);

    const USER_AGENT = 'Nozilla: XAPI Tester Version/1.0';
    const CHROME_USER_AGENT = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

    headers['User-Agent'] = isChrome ? CHROME_USER_AGENT : USER_AGENT;
    headers['request-id'] = `xapi-${process.pid}`;

    const apiOptions = {
        headers: headers,
        channel: 'rwd'
    };

    if (isChrome) {
        apiOptions.headers['Accept-Encoding'] = 'gzip';
    }

    if (showAkamaiHeaders) {
        apiOptions.headers['esconder-pragma'] = 'true';
        apiOptions.headers.pragma = 'akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-get-request-id, akamai-x-get-client-ip';
    }

    if (sdnClientId) {
        const tokenOptions = Object.assign(apiOptions, { clientName: sdnClientId });
        const authConfig = await getSdnToken(tokenOptions);
        if (!authConfig) {
            logger.error(`Cannot get SDN token for client ${sdnClientId}`);
            process.exit(-1);
        }
        const sdnAPIConfig = safelyParse(authConfig.data, false) || {};
        apiOptions.headers.Authorization = `Bearer ${sdnAPIConfig['access_token']}`;
        logger.info(`Using SDN Token for client ${sdnClientId}: ${sdnAPIConfig['access_token']}`);
    }

    if (useHttp) {
        httpRequest(apiHost, apiPort, apiEndpoint, method, apiOptions, postdata)
            .then(results => {
                logger.info(stringifyMsg(results));
            }).catch(err => {
                logger.error(getError(err));
            });
    } else if (withSdnTokenKeys) {
        const callback = apiOptions => {
            logger.info(`Called withSdnToken ${apiOptions.headers.Authorization}`);
            httpsRequest(apiHost, apiPort, apiEndpoint, method, apiOptions, postdata);
        };
        const sdnCallback = withSdnToken(callback);
        sdnCallback(apiOptions).then(results => {
                logger.info(stringifyMsg(results));
            }).catch(err => {
                logger.error(getError(err));
            });
    } else {
        httpsRequest(apiHost, apiPort, apiEndpoint, method, apiOptions, postdata)
            .then(results => {
                logger.info(stringifyMsg(results));
            }).catch(err => {
                logger.error(getError(err));
            });
    }
};

main();
