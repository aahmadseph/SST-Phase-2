import Storage from 'utils/localStorage/Storage';
import uiUtils from 'utils/UI';

function userXTimestampHeader(isCategoryPage = false) {
    const timestamp = Date.now();

    if (!isCategoryPage) {
        if (!digitalData.page.attributes.date) {
            digitalData.page.attributes.date = {};
        }

        digitalData.page.attributes.date.timestamp = timestamp;
    }

    return { 'x-timestamp': timestamp };
}

function setEventTimestampFBCapi() {
    const cookieUUId = Storage.local.getItem('uuid');

    if (!cookieUUId) {
        const uuid = uiUtils.uuid();
        Storage.local.setItem('uuid', uuid);

        return uuid;
    }

    return cookieUUId;
}

function purchaseEventTimeStamp() {
    const timestamp = Date.now();
    Storage.local.setItem('purchaseeventtimestamp', timestamp);

    return { 'x-timestamp': timestamp };
}

export default {
    userXTimestampHeader,
    setEventTimestampFBCapi,
    purchaseEventTimeStamp
};
