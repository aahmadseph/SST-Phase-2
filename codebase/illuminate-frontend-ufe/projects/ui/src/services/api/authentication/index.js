// This module provides API call methods for Sephora Commerce Authentication APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Authentication+APIs

// TO WHOM IT MAY CONCERN,
//
// Please do your best honest work of factoring out any of the related API
// calls from other places into this module as soon as there's an assignment
// related to this scope.

import login from 'services/api/authentication/login';
import emailVerificationStoreBI from 'services/api/authentication/emailVerificationStoreBI';
import logout from 'services/api/authentication/logout';
import resetPassword from 'services/api/authentication/resetPassword';
import validatePasswordToken from 'services/api/authentication/validatePasswordToken';
import getSdnAuthToken from 'services/api/authentication/getSdnAuthToken';
import getJwtAuthToken from 'services/api/authentication/getJwtAuthToken';
import generateTokens from 'services/api/authentication/generateLithiumSsoToken';
import getAnonymousToken from 'services/api/authentication/getAnonymousToken';

export default {
    login: login.login,
    logout,
    resetPasswordByLogin: resetPassword.resetPasswordByLogin,
    resetPassword: resetPassword.resetPassword,
    validatePasswordToken,
    emailVerificationStoreBI: emailVerificationStoreBI.emailVerificationStoreBI,
    getSdnAuthToken: getSdnAuthToken.getSdnAuthToken,
    getJwtAuthToken: getJwtAuthToken.getJwtAuthToken,
    generateTokens: generateTokens.generateTokens,
    getAnonymousToken: getAnonymousToken.getAnonymousToken
};
