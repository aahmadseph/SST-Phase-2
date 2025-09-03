import {
    UFE_ENV,
    AGENT_AWARE_SITE_ENABLED
} from '#server/config/envConfig.mjs';

import {
    ROUTER_SERVER_PORT,
    ROUTER_SERVER_NAME
} from '#server/config/envRouterConfig.mjs';

const useAltPort = (ROUTER_SERVER_NAME && ROUTER_SERVER_PORT && ROUTER_SERVER_PORT !== 443);

function inflate(msg, location, Sephora, process, serverSentURL) {

    return `<!doctype html><meta charset=utf-8><title></title>
            <script>
                data = ${msg.data};
                window.global = window;
                global.Sephora = global.Sephora || {};
                Sephora.buildMode = '${Sephora.buildMode}';
                Sephora.imageHost = '${Sephora.imageHost}';
                Sephora.mainBundlePath = '${Sephora.mainBundlePath}';
                Sephora.priorityChunkPath = '${Sephora.priorityChunkPath}';
                Sephora.componentsChunkPath = '${Sephora.componentsChunkPath}';
                Sephora.commonsChunkPath = '${Sephora.commonsChunkPath}';
                Sephora.postloadChunkPath = '${Sephora.postloadChunkPath}';
                Sephora.logger = console;
                Sephora.logger.verbose = console.info;
                Sephora.logger.info = console.log;
                Sephora.logger.isVerbose = true;
                Sephora.logger.isInfo = true;
                Sephora.logger.isWarn = true;
                Sephora.logger.isError = true;
                Sephora.debug = {
                    dataAt: function (name) {
                        return Sephora.debug.displayAutomationAttr ? name : null;
                    }
                };
                ${useAltPort ? 'Sephora.host = \'' + ROUTER_SERVER_NAME + '\';' : ''}
                ${useAltPort ? 'Sephora.sslPort = ' + ROUTER_SERVER_PORT + ';' : ''}
                Sephora['cat_or_mouse'] = '${msg['cat_or_mouse']}',
                Sephora.renderHostName = '${msg.hostname}';
                Sephora.buildInfo = ${JSON.stringify(Sephora.buildInfo)};
                Sephora.renderQueryParams = ${JSON.stringify(location.query)};
                Sephora.location = '${JSON.stringify(serverSentURL)}';
                Sephora.debug.displayAutomationAttr = ${Sephora.debug.displayAutomationAttr};
                Sephora.debug.showRootComps = ${Sephora.debug.showRootComps};
                Sephora.isThirdPartySite = false;
                Sephora.targeterNames = [];
                Sephora.serverErrors = [];
                Sephora.isSEO = ${Sephora.isSEO};
                process = {env:{NODE_ENV:'${process.env.NODE_ENV}', UFE_ENV: '${UFE_ENV}'}};
            </script>
            <script src="/js/ufe/frontend/${AGENT_AWARE_SITE_ENABLED ? 'agent.' : ''}root.bundle.js"></script>`;
}

export {
    inflate
};
