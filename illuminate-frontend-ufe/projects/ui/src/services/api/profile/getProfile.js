import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import NGPCookies from 'utils/NGPCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Profile+API

function getPublicProfileByNickname(nickname) {
    let url = `/api/users/profiles/${nickname}?source=public`;

    if (RCPSCookies.isRCPSProfileInfoGroupAPIEnabled()) {
        url = `/gway/v2/users/profiles/${nickname}?source=public`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

function getCurrentProfileEmailSubscriptionStatus() {
    const url = '/api/users/profiles/current?propertiesToInclude=emailSubscriptionInfo';

    return ufeApi
        .makeRequest(url, { method: 'GET' })
        .then(data =>
            data.errorCode ? Promise.reject(data) : data.emailSubscriptionInfo && data.emailSubscriptionInfo.subscriptionStatus === 'SUBSCRIBED'
        );
}

export function lookupProfileByLogin(email, source = 'lookup', requestOrigin = null) {
    const isNGPUserRegistrationEnabled = NGPCookies.isNGPUserRegistrationEnabled();
    const url = isNGPUserRegistrationEnabled ? '/gway/v1/dotcom/auth/v1/user/lookup' : '/api/users/profiles';

    const body = {
        email,
        source
    };

    if (requestOrigin) {
        body.requestOrigin = requestOrigin;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(data => (data.profileId ? data : Promise.reject(data)));
}

export function lookupEmailAndPhone(token, email, phone, source = 'Registration', requestOrigin = null) {
    const sdnDomain = Sephora.configurationSettings.sdnDomainBaseUrl;
    const url = `${sdnDomain}/v1/ipqs/validation`;

    const body = {
        email,
        phone,
        source
    };

    if (requestOrigin) {
        body.requestOrigin = requestOrigin;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: '*/*',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
            mode: 'cors'
        })
        .then(data => (data ? data : Promise.reject(data)));
}

export function getProfileForPasswordReset(email) {
    const isNGPUserRegistrationEnabled = NGPCookies.isNGPUserRegistrationEnabled();
    const url = isNGPUserRegistrationEnabled ? '/gway/v1/dotcom/auth/v1/user/lookup' : '/api/users/profiles';

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                source: 'resetPassword'
            })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default {
    getPublicProfileByNickname,
    getCurrentProfileEmailSubscriptionStatus,
    lookupProfileByLogin,
    lookupEmailAndPhone,
    getProfileForPasswordReset
};
