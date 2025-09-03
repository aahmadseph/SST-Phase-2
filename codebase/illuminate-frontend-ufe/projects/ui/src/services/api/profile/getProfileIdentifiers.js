import ufeApi from 'services/api/ufeApi';
import cacheConcern from 'services/api/cache';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Profile+Identifiers+API

const InputType = {
    PROFILE_ID: 'profileId',
    PUBLIC_ID: 'publicId',
    NICKNAME: 'nickName'
};

let getProfileIdentifiers = function (inputId, type) {
    let url = `/api/users/profileIdentifiers/${inputId}?type=${type}`;

    if (RCPSCookies.isRCPSProfileBiGroupAPIEnabled()) {
        url = `/gway/v2/users/profileIdentifiers/${inputId}?type=${type}`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
};

getProfileIdentifiers = cacheConcern.decorate('getProfileIdentifiers', getProfileIdentifiers);

function getProfileIdentifiersByNickname(inputId) {
    return getProfileIdentifiers(inputId, InputType.NICKNAME);
}

function getProfileIdentifiersByPublicId(inputId) {
    return getProfileIdentifiers(inputId, InputType.PUBLIC_ID);
}

function getProfileIdentifiersByProfileId(inputId) {
    return getProfileIdentifiers(inputId, InputType.PROFILE_ID);
}

export default {
    getProfileIdentifiersByNickname,
    getProfileIdentifiersByPublicId,
    getProfileIdentifiersByProfileId
};
