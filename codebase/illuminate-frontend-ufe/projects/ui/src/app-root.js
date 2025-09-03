/* eslint-disable camelcase */
/* eslint-disable no-eval */
/* eslint-disable no-console */
/*global data*/

// This file is the entry point for the front-end build only.
// It is not currently used in production.
// eslint-disable-next-line no-console
console.log('|****** Root Build Started ******|');

import InflatorRoot from './utils/framework/InflateRoot';
import Constants from 'utils/framework/Constants';
import bccUtil from 'utils/BCC';
import { extractCritical } from '@emotion/server';

// When window finishes loading, execute...
addEventListener('load', function () {
    const location = global.window.location;
    const renderQueryParams = Sephora.renderQueryParams;

    // Extract targeter names from the data for use in inflation
    const targeterNames = bccUtil.extractTargeters(data);

    // Inflate HTML and capture the output in a structured format
    const inflated = InflatorRoot.inflate(data, Constants.INDEX_INJECTION, {
        hostname: location.hostname,
        hash: renderQueryParams.hash,
        renderQueryParams,
        cat_or_mouse: Sephora['cat_or_mouse'],
        targeterNames
    });

    const extractedItems = extractCritical(inflated);
    const { css, ids } = extractedItems;
    let html = extractedItems.html;

    // Replace the generated CSS and IDs in the HTML template
    html = html.replace('[[__SEPHORA_GENERATED_CSS__]]', css).replace('[[__SEPHORA_GENERATED_IDS__]]', ids);

    // The eval function is needed here because the document and window objects
    // are replaced with undefined during the root build to simulate the node environment.
    eval('document').write(html);
    eval('document').close();

    console.log('|****** Root Build Finished ******|');
});
