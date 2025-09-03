import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';
import { CHANNELS } from 'constants/Channels';

const { getCurrentCountry, getCurrentLanguage, isFRCanada } = languageLocaleUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Media+Content+API

function getMediaContent(mediaId) {
    const frenchCacheBuster = `&ctry=${getCurrentCountry()}&lng=${getCurrentLanguage()}`;
    //
    const url = `/api/catalog/media/${mediaId}?includeRegionsMap=true${isFRCanada() ? frenchCacheBuster : ''}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

function getMediaContentByScreen(name) {
    const url = `/api/catalog/screens/${name}?includeRegionsMap=true`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Content+Store+SEO+Name+API

function getRwdMediaContent(seoName) {
    const url = `/api/util/content-seo/${seoName}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: { 'x-requested-source': CHANNELS.RWD }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default {
    getMediaContent,
    getMediaContentByScreen,
    getRwdMediaContent
};
