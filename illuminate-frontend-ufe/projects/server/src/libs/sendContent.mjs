import {
    resolve,
    basename
} from 'path';

import * as serverUtils from '#server/utils/serverUtils.mjs';
import {
    TEMPLATE_NOT_FOUND_RE
} from '#server/framework/ufe/Constants.mjs';
import {
    isUfeEnvProduction
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

let lastSendTime = 0;

export default function sendContent(msg, renderData) {

    const html = renderData.html,
        renderTime = renderData.renderTime;

    const startTime = process.hrtime();

    const msgContent = {
        renderTime: renderTime,
        html: html,
        sendDataTime: lastSendTime
    };

    // we want local devs to get what InflateRoot returns
    // in prod this will have master return a 404 to caller
    // then caller should redirect to 404 page
    if (isUfeEnvProduction && html.match(TEMPLATE_NOT_FOUND_RE)) {
        msgContent['renderFailure'] = html;
    }

    process.send(msgContent, () => {
        lastSendTime = serverUtils.getDiffTime(startTime);
        // log the time it wakes to send the data
        logger.verbose(`Send uncompressed data took ${lastSendTime} for ${msg.url}.`);
    });
}
