// This module provides API call methods for Sephora Commerce CMS API:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Sephora+Commerce+CMS+API+Specification

import getMediaContentApi from 'services/api/cms/getMediaContent';
import getUFEComponentContent from 'services/api/cms/getUFEComponentContent';

const { getMediaContent, getMediaContentByScreen, getRwdMediaContent } = getMediaContentApi;

export default {
    getMediaContent,
    getMediaContentByScreen,
    getUFEComponentContent: getUFEComponentContent.getUFEComponentContent,
    getRwdMediaContent
};
