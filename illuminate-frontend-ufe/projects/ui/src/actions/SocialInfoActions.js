import socialInfo from 'reducers/socialInfo';
const { ACTION_TYPES: TYPES } = socialInfo;
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

export default {
    TYPES,

    setUserSocialInfo: function (data) {
        Storage.local.setItem(LOCAL_STORAGE.LITHIUM_DATA, data);

        return {
            type: TYPES.SET_USER_SOCIAL_INFO,
            socialInfo: data
        };
    },

    setLithiumSuccessStatus: function (data) {
        return {
            type: TYPES.SET_LITHIUM_SUCCESS_STATUS,
            isLithiumSuccessful: data
        };
    }
};
