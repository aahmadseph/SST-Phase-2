import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Profile+Samples+List+API

const PROFILE_SAMPLE_SOURCES = {
    BI: 'biReward',
    DSG: 'dsg', //passing dsg will return the sample with dmg and dsg.
    ONLINE: 'online',
    RECENT: 'recent'
};

/**
 * Returns a list of samples from users profile for logged in or recognized users
 * @param {String} profileId - profile Id of user to retrieve samples for
 * @param {Array} sampleSources - any combination of one or more samples sources to be retrieved
 * @oparam {Object} options - can include any of the params listed in the api above
 */

// ignorign jshint because jshint does not have object literal with spread syntax support
/* jshint ignore:start */
export function getProfileSamples(profileId, sampleSources, options = {}) {
    let url = `/api/users/profiles/${profileId}/samples`;

    const qsParams = {
        sampleSources: sampleSources.join(','),
        ...options
    };

    url += '?' + urlUtils.makeQueryString(qsParams);

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}
/* jshint ignore:end */

export function getProfileSamplesByDSG(profileId, options) {
    return getProfileSamples(profileId, [PROFILE_SAMPLE_SOURCES.DSG], options).then(data => data.dsg);
}

export default {
    getProfileSamplesByDSG,
    getProfileSamples
};
