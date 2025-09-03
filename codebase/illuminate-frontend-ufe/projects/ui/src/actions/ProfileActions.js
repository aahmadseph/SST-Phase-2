import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import biApi from 'services/api/beautyInsider';
import userActions from 'actions/UserActions';
import customerLimitQuery from 'services/api/profile/customerLimit/customerLimitQuery';
import GraphQLException from 'exceptions/GraphQLException';
import { beautyInsiderAccountSelector } from 'selectors/user/beautyInsiderAccount/beautyInsiderAccountSelector';
import Storage from 'utils/localStorage/Storage';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import {
    SHOW_SAVED_MESSAGE,
    SET_ACCOUNT_HISTORY_SLICE,
    SHOW_EDIT_MY_PROFILE_MODAL,
    SHOW_EDIT_FLOW_MODAL,
    SHOW_SOCIAL_REGISTRATION_MODAL,
    SHOW_SOCIAL_REOPT_MODAL,
    SET_CUSTOMER_LIMIT_ERROR,
    SET_CUSTOMER_LIMIT
} from 'constants/actionTypes/profile';

import profileReducer from 'reducers/profile';
const { ACTION_TYPES: TYPES } = profileReducer;

function setAccountHistorySlice(accountHistorySlice) {
    return {
        type: SET_ACCOUNT_HISTORY_SLICE,
        accountHistorySlice: accountHistorySlice
    };
}

export default {
    TYPES,
    showEditMyProfileModal: function (isOpen, saveBeautyTraitCallBack) {
        return {
            type: SHOW_EDIT_MY_PROFILE_MODAL,
            isOpen: isOpen,
            saveBeautyTraitCallBack: saveBeautyTraitCallBack
        };
    },

    showEditFlowModal: function (isOpen, title, content, biAccount, socialProfile, saveProfileCallback) {
        return {
            type: SHOW_EDIT_FLOW_MODAL,
            isOpen: isOpen,
            title: title,
            content: content,
            biAccount: biAccount,
            socialProfile: socialProfile,
            saveProfileCallback: saveProfileCallback
        };
    },

    showSavedMessage: function (isSave) {
        return {
            type: SHOW_SAVED_MESSAGE,
            isSave: isSave
        };
    },

    showSocialRegistrationModal: function (isOpen, isBi, socialRegistrationProvider) {
        //Analytics - Track Modal
        const pageDetail = isBi ? 'nickname' : 'nickname birthday';

        if (isOpen) {
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'social registration:' + pageDetail + ':n/a:*',
                    pageType: 'social registration',
                    pageDetail
                }
            });
        }

        return {
            type: SHOW_SOCIAL_REGISTRATION_MODAL,
            isOpen: isOpen,
            socialRegistrationProvider: socialRegistrationProvider
        };
    },

    showSocialReOptModal: function (isOpen, socialReOptCallback, cancellationCallback = false) {
        //Analytics - Track Modal
        if (isOpen) {
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'social registration:re-opt in:n/a:*',
                    pageType: 'social registration',
                    pageDetail: 're-opt in'
                }
            });
        }

        return {
            type: SHOW_SOCIAL_REOPT_MODAL,
            isOpen: isOpen,
            socialReOptCallback: socialReOptCallback,
            cancellationCallback: cancellationCallback
        };
    },

    updateBiAccount: function (change, successCallback, errorCallback) {
        return dispatch => {
            biApi
                .updateBiAccount(change)
                .then(() => {
                    dispatch(userActions.getUserFull(null, successCallback));
                })
                .catch(reason => {
                    if (reason.errorMessages && typeof errorCallback === 'function') {
                        errorCallback();
                    }
                });
        };
    },
    getAccountHistorySlice: function (profileId, offset = 0, limit = 10) {
        return dispatch => {
            biApi.getBiAccountHistory(profileId, offset, limit).then(data => dispatch(setAccountHistorySlice(data)));
        };
    },
    fetchCustomerLimit: async function () {
        return async (dispatch, getState) => {
            try {
                // GQL Expects variable name to be "loyaltyId"
                let { biAccountId: loyaltyId } = beautyInsiderAccountSelector(getState()) || {};
                loyaltyId ||=
                    Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.beautyInsiderAccount?.biAccountId ||
                    Storage.local.getItem(LOCAL_STORAGE.BI_ACCOUNT_ID);

                const currency = localeUtils.ISO_CURRENCY[userUtils.getShippingCountry().countryCode];

                const payload = await customerLimitQuery(loyaltyId, currency);

                // Dispatch action to set customer limit data in the state
                return dispatch({
                    type: SET_CUSTOMER_LIMIT,
                    payload
                });
            } catch (error) {
                // If the error contains a GraphQL error structure
                // Dispatch the error as part of the customerLimit object
                return dispatch({
                    type: SET_CUSTOMER_LIMIT_ERROR,
                    payload: {
                        error:
                            error instanceof GraphQLException
                                ? error
                                : {
                                    message: error.message || 'An error occurred while fetching customer limit',
                                    status: 500
                                }
                    }
                });
            }
        };
    }
};
