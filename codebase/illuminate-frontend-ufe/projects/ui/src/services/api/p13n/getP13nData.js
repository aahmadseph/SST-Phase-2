import ufeApi from 'services/api/ufeApi';
import Empty from 'constants/empty';

// TODO Update link for proper confluence docs when it becomes available
// https://jira.sephora.com/browse/EXP-4824?focusedCommentId=1497226&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-1497226

const path = '/api/content/p13n/';

function getP13nData({
    atgId, biId, contextEntryIds, channel, language, country, zipCode
}) {
    const entryIds = contextEntryIds.join(',');
    let queryParams = `?atgId=${atgId}&context=${entryIds}&ch=${channel}&loc=${language}-${country}`;

    if (biId) {
        queryParams += `&biId=${biId}`;
    }

    if (zipCode) {
        queryParams += `&zipcode=${zipCode}`;
    }

    const url = `${path}${queryParams}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(({ data = Empty.Array, errorCode }) => {
        if (errorCode) {
            return Promise.reject(data);
        }

        return data;
    });
}

export default getP13nData;
