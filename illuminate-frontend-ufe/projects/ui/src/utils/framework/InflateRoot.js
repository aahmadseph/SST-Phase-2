/* eslint-disable camelcase */
import 'core-js/actual';
import 'regenerator-runtime/runtime';

import React from 'react';
import printTimestamp from 'utils/Timestamp';
import PageTemplates from 'constants/PageTemplates';
import Constants from 'utils/framework/Constants';
import bccUtils from 'utils/BCC';
import { isUfeEnvProduction, isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import bccTestsUtil from 'utils/bccTests';
import { SpaTemplatesInfo } from 'constants/SpaTemplatesInfo';
import Msg from 'utils/framework/Msg';
import { renderToStaticMarkup } from 'react-dom/server';

const { buildTargetersQueryParams } = bccUtils;

const isSpaTemplate = template => SpaTemplatesInfo.some(x => x.template === template);

(function () {
    // Initialize static backend globals. These can never change between requests.
    global.Sephora.isNodeRender = true;

    Sephora.isLazyLoadEnabled = true;
    Sephora.configurationSettings = {};
    Sephora.fantasticPlasticConfigurations = {};
    Sephora.Util = {
        InflatorComps: {
            services: {
                loadEvents: {
                    HydrationFinished: false
                }
            }
        }
    };
}());

const LocalOrQAEnvironment = isUfeEnvQA || isUfeEnvLocal;
const ROUNDING_PRECISION = 6;
let Performance;

const InflatorRoot = {
    inflate: function (data, renderType = Constants.INDEX_INJECTION, options = {}) {
        // setup the logger
        Sephora.logger = options.logger || console;

        const renderQueryParams = options.renderQueryParams || {};

        Sephora.logger.info(
            `${!options.logger ? printTimestamp() : ''} Rendering Template:: ` +
                `Country:${renderQueryParams.country || ''} ` +
                `Channel:${data.templateInformation.channel} ` +
                `Language:${renderQueryParams.language || ''} ` +
                `Template:${data.templateInformation.template} ` +
                `RenderType:${renderType} ` +
                `RenderHost:${options.hostname} ` +
                `RemoteHost:${options.remoteHost} ` +
                `HashKey:${options.hash} ` +
                `URL:${options.location ? options.location.pathname : ''} ` +
                `CachedQueryParams:${options.location && options.location.search ? options.location.search : ''} ` +
                `DontCache:${renderQueryParams.dontCache} ` +
                `ABTest:${renderQueryParams.abTest || ''} ` +
                `ChildProcessStats:${options.stats}`
        );

        if (typeof data.templateInformation.template === 'undefined') {
            throw new Error('Parameter "template" is required.');
        }

        // Initialize / reset request level globals
        Sephora.renderQueryParams = options.renderQueryParams;
        Sephora.location = options.location;
        Sephora.renderHostName = options.hostname;
        Sephora.catOrMouse = options['cat_or_mouse'];
        Sephora.channel = data.templateInformation.channel;
        Sephora.pagePath = data.templateInformation.template;
        Sephora.linkSPA = {};
        Sephora.checkForRoot = null;
        Sephora.serverErrors = [];
        Sephora.Msg = Msg;
        Sephora.isSPA = isSpaTemplate(data.templateInformation.template);
        Sephora.headerFooterTemplate = data.headerFooterTemplate.data;
        Sephora.configurationSettings = Object.assign(
            {
                bvApi_rwdRating_mWeb_read: {},
                bvApi_rwdRating_desktop_read: {},
                bvApi_rwdQandA_desktop_read: {},
                bvApi_rwdQandA_mWeb_read: {},
                bvApi_rwdQandA_write: {},
                bvApi_rich_profile: {},
                bvApi_review_page: {},
                bvApi_ppage: {},
                imgFixURL: Sephora.imageHost,
                loqateAddressValidationKeys: {},
                fantasticPlasticConfigurations: {},
                core: {}
            },
            data.apiConfigurationData
        );
        // ILLUPH-120733 so it seems that someone has decided to start
        // doing attacks against node.js and they send no apiConfigurationData
        // so this next line crashes template child
        // in all react components wrapComponentRender catches when a component
        // render throws an error, but this is a special case
        // https://jira.sephora.com/browse/ILLUPH-115934
        Sephora.configurationSettings.ABTests = bccTestsUtil.getOnlyValidTests(Sephora.configurationSettings.ABTests);

        Sephora.isMobile = function () {
            return Sephora.channel === 'MW';
        };

        Sephora.isDesktop = function () {
            return Sephora.channel === 'FS';
        };

        // so as part of the build we generate a list of files in the pages directory
        // for now all should work, but in 2019.1 this code is intended to be changed to
        // prevent this from happening.
        if (!PageTemplates[data.templateInformation.template]) {
            Sephora.logger.error(`Template ${data.templateInformation.template} not found!`);

            return `${Constants.DOCUMENT_TYPE}<html>Template ${data.templateInformation.template} not found!</html>`;
        }

        let pageRenderTime = 0;

        if (LocalOrQAEnvironment) {
            if (Sephora.performance) {
                Sephora.performance.clear();
            } else {
                Performance = require('utils/framework/performance/Performance').default;
                Performance.initialize();
            }

            pageRenderTime = Performance.now();
        }

        const Index = require('Index/Index').default;

        let pageFrame = renderToStaticMarkup(<Index {...data} />);

        if (LocalOrQAEnvironment && Sephora.logger.isVerbose) {
            pageRenderTime = Performance.now() - pageRenderTime;
            const {
                renderTime: { hocs, wrapComponentRender, wrapComponentRenderCallsCounter }
            } = Sephora.performance;
            let hocsRenderTime = 0;
            let hocsCounter = 0;

            // eslint-disable-next-line guard-for-in
            for (const key in hocs) {
                const item = hocs[key];
                hocsRenderTime += item.renderFunctionTime;
                hocsCounter += item.counter;
                item.renderFunctionTime = Number(item.renderFunctionTime.toFixed(ROUNDING_PRECISION));
                delete item.renderTime;
            }

            const frameworkRenderTime = Number(wrapComponentRender.toFixed(ROUNDING_PRECISION));
            const frameworkPercentage = Number(((wrapComponentRender * 100) / pageRenderTime).toFixed(ROUNDING_PRECISION));
            hocsRenderTime = Number(hocsRenderTime.toFixed(ROUNDING_PRECISION));
            const hocsPercentage = Number(((hocsRenderTime * 100) / pageRenderTime).toFixed(ROUNDING_PRECISION));

            Sephora.logger.verbose(
                JSON.stringify({
                    message: 'Page render metrics (time in milliseconds)',
                    'HOCs details': hocs,
                    'Render time of the page (renderToStaticMarkup)': Number(pageRenderTime.toFixed(ROUNDING_PRECISION)),
                    'Render time of the framework (wrapComponentRender)': frameworkRenderTime,
                    'Render time of HOCs': hocsRenderTime,
                    'Number of HOCs invocations': hocsCounter,
                    'Number of components been rendered': wrapComponentRenderCallsCounter,
                    'Percentage of time taken by HOCs compared to page render time': hocsPercentage,
                    'Percentage of time taken by framework compared to page render time': frameworkPercentage,
                    url: options.renderQueryParams.urlPath
                })
            );
        }

        // Inject the user full query string after the fact
        // This includes targeterNames for all targeters on the page
        const targeterNames = options.targeterNames || [];
        const queryParamString = buildTargetersQueryParams(targeterNames);

        pageFrame = pageFrame.replace(Constants.TARGETER_QUERY_PARAMS, queryParamString);

        // in none production we can do this expensive replace
        // for some reason in the render of Index..jsx this was turing up empty
        // but the global has the data,
        if (!isUfeEnvProduction && pageFrame) {
            pageFrame = pageFrame.replace('[[SEPHORA_SERVER_ERROR]]', JSON.stringify(Sephora.serverErrors));
        }

        return Constants.DOCUMENT_TYPE + pageFrame;
    }
};

export default InflatorRoot;
